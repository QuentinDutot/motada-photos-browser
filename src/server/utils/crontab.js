const cron = require('node-cron');
const reboot = require('nodejs-system-reboot');
const Scraper = require('../bots/scraper.js');
const Images = require('../api/images.model.js');

module.exports = () => {

  function betterTags(tags) {
    return (tags
      .map(e => e.split(',').join(''))
      .map(e => e.split('.').join(''))
      .map(e => e.charAt(0).toUpperCase() + e.slice(1))
      .filter(e => e.length > 1)
      .filter(e => e !== 'Or' && e !== 'And' && e !== 'By' && e !== 'The' && e !== 'In' && e !== 'Of')
      .filter(e => e !== 'Not' && e !== 'To' && e !== 'On' && e !== 'At' && e !== 'His' && e !== 'Her'));
  }

  function persistImages(images) {
    images.forEach((item) => {
      new Images({
        url: item.url,
        title: item.title,
        source: item.source,
        tags: betterTags(item.tags),
      }).save();
    });
  }

  async function scrapeImages(website) {
    const scraper = new Scraper();
    try {
      await scraper.start();
      await scraper.api(website);
      await scraper.api.flow();
      const result = await scraper.api.export();
      persistImages(result);
    } catch(e) {
      console.error(e);
    } finally {
      await scraper.stop();
    }
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
