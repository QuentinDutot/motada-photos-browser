const cron = require('node-cron');
const reboot = require('nodejs-system-reboot');
const Scraper = require('../bots/scraper.js');
const Images = require('../api/images.model.js');

module.exports = () => {

  function persistImages(images) {
    images.forEach((item) => {
      new Images({
        url: item.url,
        title: item.title,
        source: item.source,
        tags: item.tags,
      }).save();
    });
  }

  async function scrapeImages(website) {
    const scraper = new Scraper();
    await scraper.start();
    await scraper.api(website);
    await scraper.api.flow();
    const result = await scraper.api.export();
    await scraper.stop();
    persistImages(result);
  }

  async function engine() {
    await scrapeImages('pexels');
    await scrapeImages('negative');
    await scrapeImages('kaboom');
    // scrapeImages('unsplash'); TOFIX

    // Automatically post on social medias TOFIX
    // const image = database.get('images').sample().value();
    // await require('../scrapers/twitter.js')(image);

    // Reboot to cut any possible memory leaks
    // Not working on heroku
    // reboot((err, stderr, stdout) => {
    //   if(!err && !stderr) console.log(stdout);
    // });
  }

  cron.schedule(process.env.SCRAPING_CRON || '00 */1 * * *', () => engine());
};
