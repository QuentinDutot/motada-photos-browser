const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const randomWord = require('random-words');

const rootPath = '//*[@id="content"]/div/div[2]/div/div[2]/div';
const infosPath = '/a/img';
const nextPagePath = '//*[@id="content"]/div/a';

const search = 'https://pixabay.com/photos';
let driver;

function scrapeItems(callback) {
  const items = [];
  driver.findElements(webdriver.By.xpath(rootPath)).then((elements) => {
    console.log(`${elements.length} items loaded`);
    console.log('Scraping data...');

    elements.forEach((row, rowIndex) => {
      if(rowIndex !== 0) return;// test only

      const customImage = {
        url: '',
        title: '',
        source: 'pixabay',
        tags: [],
      };

      row.findElement(webdriver.By.xpath(`${rootPath}[${rowIndex + 1}]${infosPath}`)).then((image) => {
        driver.executeScript('arguments[0].scrollIntoView(true);', image);
        image.getAttribute('alt').then((title) => { // image's &title
          customImage.title = title;
          title.split(' ').forEach(word => { // image's tags
            if(word.length > 1
              && word !== 'Or' && word !== 'And' && word !== 'By'
              && word !== 'The' && word !== 'In' && word !== 'Of'
              && word !== 'Not' && word !== 'To' && word !== 'On') {
              customImage.tags.push(word.split(',').join(''));
            }
          });
          customImage.tags = [...new Set(customImage.tags)];
          image.getAttribute('srcset').then((url) => { // image's url
            customImage.url = url;// TODO
            console.log(customImage.url);
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

function nextPage(callback) {
  driver.findElement(webdriver.By.xpath(nextPagePath)).then((button) => {
    button.click().then(() => {
      driver.sleep(2000 + Math.floor(Math.random() * 1000)).then(() => {
        callback(true);
      });
    });
  }).catch(() => {
    callback(false);
  });
}

function scrapePages(items, callback) {
  scrapeItems((newItems) => {
    nextPage((newPage) => {
      if(newPage && false) {// test only
        scrapePages([...items, ...newItems], callback);
      } else {
        callback([...items, ...newItems]);
      }
    });
  });
}

module.exports = (callback) => {
  console.log('pixabay scraper started');
  driver = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.chrome().set('chromeOptions', { 'args': ['--headless', '--window-size=400,650', '--no-sandbox'] }))
            .build();
  const url = `${search}/?q=${randomWord()}`;
  console.log(url);
  driver.get(url).then(() => {
    scrapePages([], (items) => {
      driver.quit();
      //console.log(items.length);
      //callback(items);
    });
  });
};
