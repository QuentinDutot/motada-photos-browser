const shortid = require('shortid');
const cron = require('node-cron');

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

  cron.schedule('0 */2 * * *', () => {
    require('../scrapers/unsplash.js')(items => saveImages(items));
  });

  cron.schedule('15 */2 * * *', () => {
    require('../scrapers/pexels.js')(items => saveImages(items))
  });

  /*cron.schedule('* * * * *', () => {
    require('../scrapers/pixabay.js')(items => saveImages(items))
  });*/
};
