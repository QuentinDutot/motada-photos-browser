const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const randomWord = require('random-words');

const rootPath = '//*[@id="gridSingle"]/div';
const infosPath = '/div/figure/a/div/img';
const tagsPath = '/div/figure/div[3]/div/div/div';

const search = 'https://unsplash.com/search/photos';
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
        source: 'unsplash',
        tags: [],
      };

      row.findElement(webdriver.By.xpath(`${rootPath}[${rowIndex + 1}]${infosPath}`)).then((image) => {
        image.getAttribute('alt').then((title) => { // image's title
          customImage.title = title;
          image.getAttribute('srcset').then((url) => { // image's url
            [customImage.url] = url.split('?');
            row.findElements(webdriver.By.xpath(`${rootPath}[${rowIndex + 1}]${tagsPath}`)).then((tags) => { // image's tags
              tags.forEach((tagElement, tagIndex) => {
                tagElement.getText().then((tag) => {
                  customImage.tags.push(tag);
                  if (tagIndex === tags.length - 1) {
                    items.push(customImage);
                    if (rowIndex === elements.length - 1) {
                      callback(items);
                    }
                  }
                });
              });
            });
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
  console.log('unsplash scraper started');
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
