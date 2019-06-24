const randomWord = require('random-words');

class Pexels {

	constructor(core) {
    this.core = core;
    this.items = [];
    this.data = [];
  }
  
  async flow() {
    console.log('Pexels Scraping (PS) started');
    await this.goto();
    await this.scroll();
    await this.collect();
    await this.browse();
    console.log('Pexels Scraping (PS) ended');
  }

  async goto() {
    const word = randomWord();
    const search = `https://www.pexels.com/search/${word}`;
    console.log(`PS : go to ${search}`);
    await this.core.goto(search);
  }

  async scroll() {
    const scroll = { height: 0, continue: false };
    console.log('PS : scrolling down');
    do {
      scroll.height = await this.core.evaluate('document.body.scrollHeight');
      await this.core.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await this.core.waitFor(3 * 1000);
      scroll.continue = await this.core.evaluate('document.body.scrollHeight') > scroll.height;
    } while(scroll.continue);
  }

  async collect() {
    const columns = [
      (await this.core.$x('/html/body/div[1]/div[3]/div[2]/div[1]/div')).length,
      (await this.core.$x('/html/body/div[1]/div[3]/div[2]/div[2]/div')).length,
    ].filter(e => e != 0);
    console.log('PS : collecting items');
    for (let column = 1; column < columns.length + 1; column++) {
      for (let image = 1; image < columns[column - 1]; image++) {
        const [item] = await this.core.$x(`/html/body/div[1]/div[3]/div[2]/div[${column}]/div[${image}]/article/a[1]/img`);
        if (item) this.items.push(item);
      }
    }
  }

  async browse() {
    console.log('PS : scraping items');
    for (let index = 0; index < this.items.length; index++) {
      await this.scrape(this.items[index]);
    }
  }

  async scrape(item) {
    let title = await this.core.evaluate(e => e.getAttribute('alt'), item);
    if (title.indexOf('Free stock photo of ') !== -1) title = title.slice(20);

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

    this.data.push({ source: 'pexels', tags, title, url });
  }

  async export() {
    console.log(`PS : exporting ${this.data.length} scraped photos`);
    return this.data;
  }
  
}

module.exports = Pexels;