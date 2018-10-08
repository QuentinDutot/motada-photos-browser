const express = require('express');
const dbLow = require('lowdb');
const dbFileSync = require('lowdb/adapters/FileSync');
const shortid = require('shortid');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const scrapeUnsplash = require('./scrapers/unsplash.js');
const scrapePixabay = require('./scrapers/pixabay.js');
const scrapePexels = require('./scrapers/pexels.js');

const dbAdapter = new dbFileSync('database.json');
const database = dbLow(dbAdapter);
const app = express();

database.defaults({ images: [] }).write();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});

// TODO pagination : https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html

cron.schedule('0 */2 * * *', () => scrapeUnsplash(items => createImages(items)));
cron.schedule('15 */2 * * *', () => scrapePexels(items => createImages(items)));
// cron.schedule('30 */2 * * *', () => scrapePixabay(items => createImages(items)));

function getImage(id) {
  return database.get('images').find({ id }).value();
}

function getAllImages() {
  return database.get('images').value();
}

function isTagsInData(tags, data) {
  let included = false;
  tags.forEach((singleTag) => {
    const verif = element => {
      if(element.toLowerCase() === singleTag.toLowerCase()) {
        included = true;
      }
    }
    data.tags.forEach(verif);
    data.title.split(' ').forEach(verif);
  });
  return included;
}

function getFilteredImages(query) {
  // api/images?count
  if (Object.prototype.hasOwnProperty.call(query, 'count')) {
    return { images: database.get('images').size().value() };
  }
  // api/images?random=3
  if (Object.prototype.hasOwnProperty.call(query, 'random')) {
    return database.get('images').sampleSize(query.random || 1).value();
  }
  // api/images?last=3
  if (Object.prototype.hasOwnProperty.call(query, 'last')) {
    return database.get('images').sortBy('date').reverse().take(query.last || 1).value();
  }
  // api/images?tags=sky,car
  if (Object.prototype.hasOwnProperty.call(query, 'tags')) {
    let tags = query.tags.split(',');
    tags = tags.map(tag => tag.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '));
    delete query.tags;
    return database.get('images').filter(data => isTagsInData(tags, data)).filter(query).value();
  }
  // api/images?...
  return database.get('images').filter(query).value();
}

function createImage(img) {
  if (!database.get('images').find({ url: img.url }).value()) {
    const id = shortid.generate();
    const result = database.get('images').push({
      id,
      url: img.url,
      title: img.title || '',
      source: img.source || '',
      date: Date.now(),
      tags: img.tags || [],
      click: 0,
    }).write();
    return result && getImage(id).url.length > 0;
  }
  return false;
}

function createImages(imgs) {
  let error = false;
  imgs.forEach((img) => {
    if(createImage(img)) error = true;
  });
  return error;
}

app.get('/api/images/:id?', (req, res) => {
  let images;
  if (req.params.id !== undefined) {
    // api/images/z_ae77ml
    images = getImage(req.params.id);
  } else if (Object.keys(req.query).length === 0) {
    // api/images
    images = getAllImages();
  } else {
    // api/images?...
    images = getFilteredImages(req.query);
  }
  if(typeof images === 'array') {
    res.send(images.sort((a, b) => (a.click || 0) - (b.click || 0)));
  } else {
    res.send(images);
  }
});

app.patch('/api/images/:id?', (req, res) => {
  const id = req.params.id || req.body.id || -1;
  const updatedImage = req.body;
  if(req.body.id) delete updatedImage.id;
  if(getImage(id)) {
    const request = database.get('images').find({ id }).assign(updatedImage).write();
    res.send(Boolean(request));
  } else {
    res.send(false);
  }
});

app.post('/api/images', (req, res) => {
  res.send(createImage(req.body));
});

app.post('/api/scrapers/:scraper', (req, res) => {
  const callback = items => createImages(items);
  switch(req.params.scraper) {
    case 'pexels':
      scrapePexels(callback);
      break;
    case 'pixabay':
      scrapePixabay(callback);
      break;
    case 'unsplash':
    default:
      scrapeUnsplash(callback);
  }
  res.send(true);
});

app.listen(8080, () => console.log('Listening on port 8080!'));
