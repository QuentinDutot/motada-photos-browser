const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const randomWord = require('random-words');

const rootPath = '/html/body/div[1]/div[2]/div[3]/article';
const infosPath = '/a/img';

const search = 'https://www.pexels.com/search';
let driver;

function scrapeItems(callback) {
  const items = [];
  driver.findElements(webdriver.By.xpath(rootPath)).then((elements) => {
    console.log(`${elements.length} items loaded`);
    console.log('Scraping data...');

    elements.forEach((row, rowIndex) => {
      const customImage = {
        url: '',
        title: '',
        source: 'pexels',
        tags: [],
      };

      row.findElement(webdriver.By.xpath(`${rootPath}[${rowIndex + 1}]${infosPath}`)).then((image) => {
        image.getAttribute('alt').then((title) => { // image's title
          customImage.title = title.indexOf('Free stock photo of ') !== -1 ? title.slice(20) : title;
          customImage.title.split(' ').forEach(tags => { // image's tags
            let tag = tags.split(',').join('');
            tag = tag.charAt(0).toUpperCase()+tag.slice(1);
            if(tag.length > 1
              && tag !== 'Or' && tag !== 'And' && tag !== 'By'
              && tag !== 'The' && tag !== 'In' && tag !== 'Of'
              && tag !== 'Not' && tag !== 'To' && tag !== 'On') {
              customImage.tags.push(tag);
            }
          });
          image.getAttribute('srcset').then((url) => { // image's url
            [customImage.url] = url.split('?');
            items.push(customImage);
            if (rowIndex === elements.length - 1) {
              callback(items);
            }
          });
        });
      });
    });
  });
}

function loadAllItems(callback) {
  console.log('Loading items...');
  driver.findElements(webdriver.By.xpath(rootPath)).then((elements) => {
    driver.executeScript('arguments[0].scrollIntoView(true);', elements[elements.length - 1]);
    driver.sleep(1000 + Math.floor(Math.random() * 1000)).then(() => {
      driver.findElements(webdriver.By.xpath(rootPath)).then((newElements) => {
        if (newElements.length > elements.length) {
          loadAllItems(callback);
        } else {
          callback();
        }
      });
    });
  });
}

module.exports = async (callback) => {
  console.log('pexels scraper started');
  driver = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.chrome().set('chromeOptions', { 'args': ['--headless', '--window-size=400,650', '--no-sandbox'] }))
            .build();
  const url = `${search}/${randomWord()}`;
  console.log(url);
  driver.get(url).then(() => {
    loadAllItems(() => {
      scrapeItems((items) => {
        driver.quit();
        console.log(items);
        callback(items);
      });
    });
  });
};
