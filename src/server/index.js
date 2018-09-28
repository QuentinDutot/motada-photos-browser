const express = require('express');
const dbLow = require('lowdb');
const dbFileSync = require('lowdb/adapters/FileSync');
const shortid = require('shortid');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const scrapeUnsplash = require('./unsplash.js');

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

cron.schedule('* */2 * * *', () => {
  console.log('unsplash scraper - cron');
  scrapeUnsplash((items) => {
    // console.log(items);
    items.forEach(item => createImage(item));
  });
});

function getImage(id) {
  return database.get('images').find({ id }).value();
}

function getAllImages() {
  return database.get('images').value();
}

function isTagsInData(tags, data) {
  let included = false;
  tags.forEach((singleTag) => {
    const searchIn = Object.keys(data).reduce((res, val) => (val !== 'id') ? res + data[val] : res, '');
    if (searchIn.toLowerCase().includes(singleTag.toLowerCase())) {
      included = true;
    }
  });
  return included;
}

function getFilteredImages(query) {
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
    }).write();
    return result && getImage(id).url.length > 0;
  }
  return false;
}

app.get('/api/images/:id?', (req, res) => {
  if (req.params.id !== undefined) {
    // api/images/z_ae77ml
    res.send(getImage(req.params.id));
  } else if (Object.keys(req.query).length === 0) {
    // api/images
    res.send(getAllImages());
  } else {
    // api/images?...
    res.send(getFilteredImages(req.query));
  }
});

app.post('/api/images', (req, res) => {
  res.send(createImage(req.body));
});

app.listen(8080, () => console.log('Listening on port 8080!'));
