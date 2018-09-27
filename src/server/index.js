const express = require('express');
const os = require('os');
const dbLow = require('lowdb');
const dbFileSync = require('lowdb/adapters/FileSync');
const shortid = require('shortid');
const bodyParser = require('body-parser');
const cron = require("node-cron");
const scrapeUnsplash = require('./unsplash.js');

const dbAdapter = new dbFileSync('database.json');
const database = dbLow(dbAdapter);
const app = express();

database.defaults({ images: [] }).write();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// TODO pagination : https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html

cron.schedule("* */2 * * *", function() {
  scrapeUnsplash((items) => {
    console.log(items);
    items.forEach((item) => createImage(item));
  });
});

function createImage(img) {
  // TODO Tester si l'url est déjà connue

  const newImg = {
    id: shortid.generate(),
    url: img.url,
    title: img.title || '',
    source: img.source || '',
    date: Date.now(),
    tags: img.tags || [],
  };

  const result = database.get('images').push(newImg).write();

  // TODO Tester si l'enregistrement est réussi

  return result;
}

app.get('/api/images/:id?', (req, res) => {
  const query = req.query;
  const params = req.params;
  let results;

  if(params.id !== undefined) {// api/images/z_ae77ml
    results = database.get('images').find({ id: params.id }).value();

  } else if(Object.keys(query).length === 0) {// api/images
    results = database.get('images').value();

  } else if(query.hasOwnProperty('random')) {// api/images?random=3
    results = database.get('images').sampleSize(query.random || 1).value();

  } else if(query.hasOwnProperty('last')) {// api/images?last=3
    results = database.get('images').sortBy('date').reverse().take(query.last || 1).value();

  } /*else if(query.hasOwnProperty('tags')) {// api/images?tags=sky,car
    results = database.get('images').some(query.tags.split('/')).value();// TODO

  }*/ else {// api/images?...
    results = database.get('images').filter(query).value();
  }

  res.send(results);
});

app.post('/api/images', (req, res) => {
  res.send(createImage(req.body));
});

app.listen(8080, () => console.log('Listening on port 8080!'));
