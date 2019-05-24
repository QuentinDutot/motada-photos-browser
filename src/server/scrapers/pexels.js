const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const randomWord = require('random-words');

const rootPath = '/html/body/div[1]/div[3]/div[2]/div/div';
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
    const image = await driver.findElement(webdriver.By.xpath(`${rootPath}[${itemIndex + 1}]/article/a/img`));

    // Building custom object
    const customImage = { source: 'pexels', tags: [], };
    customImage.title = await image.getAttribute('alt');
    customImage.title = customImage.title.indexOf('Free stock photo of ') !== -1 ? customImage.title.slice(20) : customImage.title;
    [customImage.url] = (await image.getAttribute('srcset')).split('?');

    // Adding tags
    const tags = customImage.title.split(' ');
    for(let tag of tags) {
      tag = tag.split(',').join('');
      tag = tag.split('.').join('');
      tag = tag.charAt(0).toUpperCase()+tag.slice(1);
      if(tag.length > 1
        && tag !== 'Or' && tag !== 'And' && tag !== 'By'
        && tag !== 'The' && tag !== 'In' && tag !== 'Of'
        && tag !== 'Not' && tag !== 'To' && tag !== 'On') {
        customImage.tags.push(tag);
      }
    }

    // Store our custom object
    images.push(customImage);
    itemIndex++;
  }
  return images;
};

module.exports = async (persist) => {
  console.log('Pexels scraper ON');
  const url = `https://www.pexels.com/search/${randomWord()}`;

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
    console.log('Pexels scraper OFF : success');

  } catch(error) {
    console.log(`Pexels scraper OFF : ${JSON.stringify(error)}`);
  }
};
