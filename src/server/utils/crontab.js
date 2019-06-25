const shortid = require('shortid');
const cron = require('node-cron');
const reboot = require('nodejs-system-reboot');
const Scraper = require('../bots/scraper.js');

module.exports = function(database) {

  function saveImages(images) {
    images.forEach((item) => {
      const exist = database.get('images').find({ url: item.url }).value();
      if (!exist) {
        database.get('images').push({
          id: shortid.generate(),
          url: item.url,
          title: item.title || '',
          source: item.source || '',
          date: Date.now(),
          tags: item.tags || [],
          click: 0,
        }).write();
      }
    });
  }

  async function scrapeImages(website) {
    const scraper = new Scraper();
    await scraper.start();
    await scraper.api(website);
    await scraper.api.flow();
    const result = await scraper.api.export();
    await scraper.stop();
    saveImages(result);
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
