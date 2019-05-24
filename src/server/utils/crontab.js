const shortid = require('shortid');
const cron = require('node-cron');
const reboot = require('nodejs-system-reboot');

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
  };

  async function engine() {
    // Let's find new data
    // await require('../scrapers/unsplash.js')(items => saveImages(items)); TODO FIX
    await require('../scrapers/pexels.js')(items => saveImages(items));

    // Automatically post on social medias
    const image = database.get('images').sample().value();
    await require('../scrapers/twitter.js')(image);

    // Reboot to cut any possible memory leaks
    reboot((err, stderr, stdout) => {
      if(!err && !stderr) console.log(stdout);
    });
  }

  cron.schedule('00 */2 * * *', () => engine());
};
