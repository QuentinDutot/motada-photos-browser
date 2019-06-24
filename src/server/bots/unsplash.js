const randomWord = require('random-words');

class Unsplash {

	constructor(core) {
    this.core = core;
    this.items = [];
    this.data = [];
  }
  
  async flow() {
    console.log('Unsplash Scraping (US) started');
    await this.goto();
    await this.scroll();
    await this.collect();
    await this.browse();
    console.log('Unsplash Scraping (US) ended');
  }

  async goto() {
    const word = randomWord();
    const search = `https://unsplash.com/search/photos/${word}`;
    console.log(`US : go to ${search}`);
    await this.core.goto(search);
  }

  async scroll() {
    const scroll = { height: 0, continue: false };
    console.log('US : scrolling down');
    do {
      scroll.height = await this.core.evaluate('document.body.scrollHeight');
      await this.core.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await this.core.waitFor(5 * 1000);
      scroll.continue = await this.core.evaluate('document.body.scrollHeight') > scroll.height;
    } while(scroll.continue);
  }

  async collect() {
    const columns = [
      (await this.core.$x('//*[@id="app"]/div/div[5]/div[2]/div/div[1]/div/div/div[1]/figure')).length,
      (await this.core.$x('//*[@id="app"]/div/div[5]/div[2]/div/div[1]/div/div/div[2]/figure')).length,
      (await this.core.$x('//*[@id="app"]/div/div[5]/div[2]/div/div[1]/div/div/div[3]/figure')).length,
    ].filter(e => e != 0);
    console.log('US : collecting items');
    console.log(columns);
    for (let column = 1; column < columns.length + 1; column++) {
      for (let image = 1; image < columns[column - 1]; image++) {
        const [item] = await this.core.$x(`//*[@id="app"]/div/div[5]/div[2]/div/div[1]/div/div/div[${column}]/figure[${image}]/div/div/div[1]/div/a/div/img`);
        if (item) this.items.push(item);
        else console.log(item)
      }
    }
  }

  async browse() {
    console.log('US : scraping items');
    console.log(this.items.length);
    for (let index = 0; index < this.items.length; index++) {
      await this.scrape(this.items[index]);
    }
  }

  async scrape(item) {
    let title = await this.core.evaluate(e => e.getAttribute('alt'), item);
    let url = await this.core.evaluate(e => e.getAttribute('srcset'), item);
    if (url.includes('?')) url = url.split('?')[0];

    const tags = title
      .split(' ')
      .map(e => e.split(',').join(''))
      .map(e => e.split('.').join(''))
      .map(e => e.charAt(0).toUpperCase() + e.slice(1))
      .filter(e => e.length > 1)
      .filter(e => e !== 'Or' && e !== 'And' && e !== 'By')
      .filter(e => e !== 'The' && e !== 'In' && e !== 'Of')
      .filter(e => e !== 'Not' && e !== 'To' && e !== 'On');

    this.data.push({ source: 'unsplash', tags, title, url });
  }

  async export() {
    console.log(`US : exporting ${this.data.length} scraped photos`);
    return this.data;
  }
  
}

module.exports = Unsplash;