const cron = require('node-cron')
const axios = require('axios')
const reboot = require('nodejs-system-reboot')
const Scraper = require('../bots/scraper.js')
const Images = require('../api/images.model.js')

module.exports = () => {

  function betterTags(tags) {
    return (tags
      .map(e => e.split(',').join(''))
      .map(e => e.split('.').join(''))
      .map(e => e.charAt(0).toUpperCase() + e.slice(1))
      .filter(e => e.length > 1)
      .filter(e => e !== 'Or' && e !== 'And' && e !== 'By' && e !== 'The' && e !== 'In' && e !== 'Of')
      .filter(e => e !== 'Not' && e !== 'To' && e !== 'On' && e !== 'At' && e !== 'His' && e !== 'Her'))
  }

  function persistImages(images) {
    images.forEach((item) => {
      new Images({
        url: item.url,
        title: item.title,
        source: item.source,
        tags: betterTags(item.tags),
      }).save()
    })
  }

  async function scrapeImages(website) {
    const scraper = new Scraper()
    try {
      await scraper.start()
      await scraper.api(website)
      await scraper.api.flow()
      const result = await scraper.api.export()
      persistImages(result)
    } catch(e) {
      console.error(e)
    } finally {
      await scraper.stop()
    }
  }

  // scraping cron
  // cron.schedule(process.env.SCRAPING_CRON || '00 */2 * * *', async () => {
  //   await scrapeImages('pexels')
  //   await scrapeImages('negative')
  //   await scrapeImages('kaboom')
  //   // scrapeImages('unsplash') TOFIX

  //   // Automatically post on social medias TOFIX
  //   // const image = database.get('images').sample().value()
  //   // await require('../scrapers/twitter.js')(image)

  //   // Reboot to cut any possible memory leaks
  //   // Not working on heroku
  //   // reboot((err, stderr, stdout) => {
  //   //   if(!err && !stderr) console.log(stdout)
  //   // })
  // })

  // cleaning cron
  cron.schedule(process.env.CLEANING_CRON || '00 */2 * * *', async () => {
    const items = 100

    const randomImages = await Images.aggregate([
      { $sample: { size: items } },
      { $project: { _id: true, url: true } },
      { $limit: items },
    ])
  
    randomImages.forEach((randomImage) => {
      axios.head(randomImage.url).then(async () => {
  
        // delete duplicate images
        const similarImages = await Images.find({ url: randomImage.url })
        const duplicateImages = similarImages.filter(similarImage => similarImage._id.toString() != randomImage._id.toString())
        duplicateImages.forEach(async (duplicateImage) => {
          await Images.findByIdAndRemove(duplicateImage._id)
          console.log('duplicate image deleted:', duplicateImage._id)
        })
  
      }).catch(async () => {
  
        // delete unreachable image
        await Images.findByIdAndRemove(randomImage._id)
        console.log('unreachable image deleted:', randomImage._id)
      
      })
    })
  })
}
