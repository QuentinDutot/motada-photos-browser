const randomWord = require('random-words');

// TODO scrape all pages

class Kaboom {

	constructor(core) {
    this.core = core;
    this.items = [];
    this.data = [];
  }
  
  async flow() {
    console.log('Kaboom Scraping (KS) started');
    await this.goto();
    await this.scroll();
    await this.collect();
    await this.browse();
    console.log('Kaboom Scraping (KS) ended');
  }

  async goto() {
    const word = randomWord();
    const search = `https://kaboompics.com/gallery?search=${word}`;
    console.log(`KS : go to ${search}`);
    await this.core.goto(search);
  }

  async scroll() {
    const scroll = { height: 0, continue: false };
    console.log('KS : scrolling down');
    do {
      scroll.height = await this.core.evaluate('document.body.scrollHeight');
      await this.core.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await this.core.waitFor(3 * 1000);
      scroll.continue = await this.core.evaluate('document.body.scrollHeight') > scroll.height;
    } while(scroll.continue);
  }

  async collect() {
    const length = (await this.core.$x('//*[@id="work-grid"]/li')).length;
    console.log('KS : collecting items');
    for (let image = 1; image < length + 1; image++) {
      const [item] = await this.core.$x(`//*[@id="work-grid"]/li[${image}]/div[1]/a/img`);
      if (item) this.items.push(item);
    }
  }

  async browse() {
    console.log('KS : scraping items');
    for (let index = 0; index < this.items.length; index++) {
      await this.scrape(this.items[index]);
    }
  }

  async scrape(item) {
    let title = await this.core.evaluate(e => e.getAttribute('alt'), item);
    let url = await this.core.evaluate(e => e.getAttribute('data-original'), item);

    if (!title || !url) return;
    if (title.indexOf('Kaboompics - ') !== -1) title = title.slice(13);
    if (url.indexOf('https') === -1) url = `https://kaboompics.com${url}`;

    const tags = title
      .split(' ')
      .map(e => e.split(',').join(''))
      .map(e => e.split('.').join(''))
      .map(e => e.charAt(0).toUpperCase() + e.slice(1))
      .filter(e => e.length > 1)
      .filter(e => e !== 'Or' && e !== 'And' && e !== 'By')
      .filter(e => e !== 'The' && e !== 'In' && e !== 'Of')
      .filter(e => e !== 'Not' && e !== 'To' && e !== 'On');

    this.data.push({ source: 'kaboom', tags, title, url });
  }

  async export() {
    console.log(`KS : exporting ${this.data.length} scraped photos`);
    return this.data;
  }
  
}

module.exports = Kaboom;