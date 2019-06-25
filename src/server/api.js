const express = require('express');
const similarity = require("similarity");

module.exports = function(database) {
  const router = express.Router();

  function getImage(id) {
    return database.get('images').find({ id }).value();
  };

  function isTagsInData(tags, data) {
    let included = false;
    tags.forEach((singleTag) => {
      const verif = element => {
        if(similarity(element, singleTag) > 0.80) {
          included = true;
        }
      }
      data.tags.forEach(verif);
      data.title.split(' ').forEach(verif);
    });
    return included;
  };

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
  };

  router.get('/images/:id?', (req, res) => {
    let images;
    if (req.params.id !== undefined) {
      // api/images/z_ae77ml
      images = getImage(req.params.id);
    } else if (Object.keys(req.query).length === 0) {
      // api/images
      images = database.get('images').value();
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

  router.patch('/images/:id?', (req, res) => {
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

  router.delete('/images/:id?', (req, res) => {
    const id = req.params.id;
    let result = false;
    if(getImage(id)) {
      result = Boolean(
        database.get('images')
                .remove({ id })
                .write()
      );
    }
    res.send(result);
  });

  return router;
};
