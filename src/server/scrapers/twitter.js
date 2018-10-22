const Twit = require('twit');
const request = require('request');

let T;

const initTwitter = () => new Promise((resolve, reject) => {
  try {
    const config = require('../../../config');
    T = new Twit({
      consumer_key:         config.twitter.consumer_key,
      consumer_secret:      config.twitter.consumer_secret,
      access_token:         config.twitter.access_token,
      access_token_secret:  config.twitter.access_token_secret,
    });
    resolve();
  } catch(error) {
    reject('Can\'t initialized Twitter api');
  }
});

const getPlaceId = (country) => new Promise((resolve, reject) => {
  T.get('trends/available', {}, (error, data) => {
    if(error) {
      reject('Can\'t get available trends');
    } else {
      resolve(data.find(e => e.name === country).woeid);
    }
  });
});

const getRandomTrend = (placeId) => new Promise((resolve, reject) => {
  T.get('trends/place', { id: placeId }, (error, data) => {
    if(error) {
      reject('Can\'t get trends from placeId');
    } else {
      const trends = data[0].trends;
      const randomTrend = trends[Math.floor(Math.random()*trends.length)];
      resolve(randomTrend.name);
    }
  });
});

const encodeImage = (url) => new Promise((resolve, reject) => {
  request({ url: `${url}?w=700`, encoding: null }, (error, response, body) => {
    if(body && response.statusCode === 200) {
      resolve(body.toString('base64'));
    } else {
      reject('Can\'t encode image from url');
    }
  });
});

const uploadImage = (base64) => new Promise((resolve, reject) => {
  T.post('media/upload', { media_data: base64 }, (error, data) => {
    if(error) {
      reject('Can\'t upload image');
    } else {
      resolve(data.media_id_string);
    }
  });
});

const createMetadata = (mediaId, title) => new Promise((resolve, reject) => {
  T.post('media/metadata/create', { media_id: mediaId, alt_text: { text: title } }, (error, data) => {
    if(error) {
      reject('Can\'t create metadata');
    } else {
      resolve();
    }
  });
});

const updateStatus = (mediaId, content) => new Promise((resolve, reject) => {
  T.post('statuses/update', { status: content, media_ids: [mediaId] }, (error, data) => {
    if(error) {
      reject('Can\'t update status');
    } else {
      resolve();
    }
  });
});

module.exports = async (image) => {
  console.log('twitter bot ON');
  let content = `Thousands free and high-res images on motada.io\n${image.title}\n`;
  image.tags.forEach(tag => content += `#${tag} `);

  try {

    await initTwitter();
    const placeId     = await getPlaceId('United States');
    content          += await getRandomTrend(placeId);
    const base64Image = await encodeImage(image.url);
    const mediaId     = await uploadImage(base64Image);
    await createMetadata(mediaId, image.title);
    await updateStatus(mediaId, content);
    console.log('twitter bot OFF : success');

  } catch(error) {
    console.log(`twitter bot OFF : ${error}`);
  }
};
