const Puppeteer = require("puppeteer")
const Pexels = require("./pexels")
const Unsplash = require("./unsplash")
const Negative = require("./negative")
const Kaboom = require("./kaboom")

class Scraper {

	constructor() {
    this.config = {
      headless: true,
      options: ["--disable-gpu", "--no-sandbox", "--window-size=1024x768"],
      viewport: { "width": 1024, "height": 768 },
      header: { "Accept-Language": "en" },
    }
	}

  async start() {
    const { headless, options, viewport, header } = this.config

    this.browser = await Puppeteer.launch({
      headless: headless,
      args: options,
      defaultViewport: viewport,
    })

    this.page = await this.browser.newPage()
    
		await this.page.setExtraHTTPHeaders(header)
		await this.page.setViewport(viewport)
		// await this.page.setUserAgent(this.config.puppeteer.chrome_useragent === "" ? (await this.browser.userAgent()).replace("Headless", "") : this.config.puppeteer.chrome_useragent)
  }

	async api(flow) {
    switch (flow) {
      case 'unsplash':
        this.api = new Unsplash(this.page)
        break
      case 'negative':
        this.api = new Negative(this.page)
        break
      case 'kaboom':
        this.api = new Kaboom(this.page)
        break
      case 'pexels': default:
        this.api = new Pexels(this.page)
        break
    }
  }

	async stop() {
		await this.browser.newPage()
		await this.browser.close()
  }
  
}

module.exports = Scraper