const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const randomWord = require('random-words');

const rootPath = '//*[@id="gridSingle"]/div';
let driver;

const buildDriver = () => new Promise((resolve, reject) => {
  try {
    const options = webdriver.Capabilities.chrome().set('chromeOptions', { 'args': ['--headless', '--window-size=400,650', '--no-sandbox'] });
    driver = new webdriver.Builder().withCapabilities(options).build();
    resolve('Driver built');
  } catch(error) {
    reject(`Can't build the driver : ${error}`);
  }
});

const loadItems = async () => {
  let items, newItems;
  do {
    // Load all items on the page
    items = await driver.findElements(webdriver.By.xpath(rootPath));
    console.log(`Items loaded : ${items.length}`);

    // Try to load more by scrolling
    await driver.executeScript('arguments[0].scrollIntoView(true);', items[items.length - 1])
    await driver.sleep(1000 + Math.floor(Math.random() * 1000));

    // Test if there is new items
    newItems = await driver.findElements(webdriver.By.xpath(rootPath));
  } while(newItems.length > items.length);
  return items;
};

const scrapeItems = async (items) => {
  const images = [];
  let itemIndex = 0;
  while(itemIndex < items.length) {
    // Get wanted element
    const image = await driver.findElement(webdriver.By.xpath(`${rootPath}[${itemIndex + 1}]/div/figure/a/div/img`));

    // Building custom object
    const customImage = { source: 'unsplash', tags: [], };
    customImage.title = await image.getAttribute('alt');
    [customImage.url] = (await image.getAttribute('srcset')).split('?');

    // Adding tags
    const tags = await driver.findElements(webdriver.By.xpath(`${rootPath}[${itemIndex + 1}]/div/figure/div[3]/div/div/div`));
    for(const tag of tags) {
      customImage.tags.push(await tag.getText());
    }

    // Store our custom object
    images.push(customImage);
    itemIndex++;
  }
  return images;
};

module.exports = async (persist) => {
  console.log('Unsplash scraper ON');
  const url = `https://unsplash.com/search/photos/${randomWord()}`;

  try {
    // Initializations
    await buildDriver()
    console.log('Driver built');
    await driver.get(url);
    console.log(url);

    // Engine
    const items = await loadItems();
    const images = await scrapeItems(items);
    await driver.quit();

    // Finish stuff
    persist(images);
    console.log(images);
    console.log('Unsplash scraper OFF : success');

  } catch(error) {
    console.log(`Unsplash scraper OFF : ${JSON.stringify(error)}`);
  }
};
