const randomWord = require('random-words')

// TODO scrape all pages

class Negative {

	constructor(core) {
    this.core = core
    this.items = []
    this.data = []
  }
  
  async flow() {
    console.log('Negative Scraping (NS) started')
    await this.goto()
    await this.scroll()
    await this.collect()
    await this.browse()
    console.log('Negative Scraping (NS) ended')
  }

  async goto() {
    const word = randomWord()
    const search = `https://negativespace.co/?s=${word}`
    console.log(`NS : go to ${search}`)
    await this.core.goto(search)
  }

  async scroll() {
    const scroll = { height: 0, continue: false }
    console.log('NS : scrolling down')
    do {
      scroll.height = await this.core.evaluate('document.body.scrollHeight')
      await this.core.evaluate('window.scrollTo(0, document.body.scrollHeight)')
      await this.core.waitFor(3 * 1000)
      scroll.continue = await this.core.evaluate('document.body.scrollHeight') > scroll.height
    } while(scroll.continue)
  }

  async collect() {
    const length = (await this.core.$x('//*[@id="content"]/article')).length
    console.log('NS : collecting items')
    for (let image = 1; image < length + 1; image++) {
      const [item] = await this.core.$x(`//*[@id="content"]/article[${image}]/div[1]/a/img`)
      if (item) this.items.push(item)
    }
  }

  async browse() {
    console.log('NS : scraping items')
    for (let index = 0; index < this.items.length; index++) {
      await this.scrape(this.items[index])
    }
  }

  async scrape(item) {
    let title = await this.core.evaluate(e => e.getAttribute('title'), item)
    let url = await this.core.evaluate(e => e.getAttribute('src'), item)

    const tags = title.split(' ')

    this.data.push({ source: 'negative', tags, title, url })
  }

  async export() {
    console.log(`NS : exporting ${this.data.length} scraped photos`)
    return this.data
  }
  
}

module.exports = Negative