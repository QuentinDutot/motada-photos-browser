const Twitter = require('twitter')
const request = require('request')

let client

const initTwitter = () => new Promise((resolve, reject) => {
  try {
    const config = require('../../../config')
    client = new Twitter({
      consumer_key:         config.twitter.consumer_key,
      consumer_secret:      config.twitter.consumer_secret,
      access_token_key:     config.twitter.access_token,
      access_token_secret:  config.twitter.access_token_secret,
    })
    resolve()
  } catch(error) {
    reject('Can\'t initialize Twitter client')
  }
})

const encodeImage = (url) => new Promise((resolve, reject) => {
  request({ url, encoding: null }, (error, response, body) => {
    if(body && response.statusCode === 200) {
      resolve(body.toString('base64'))
    } else {
      reject('Can\'t encode image from url')
    }
  })
})

module.exports = async (image) => {
  console.log('Twitter bot ON')
  let content = `Thousands free and high-res images on motada.io\n${image.title}\n`
  image.tags.forEach(tag => content += `#${tag} `)

  try {
    // Initializations
    await initTwitter()
    console.log('Twitter client ready')

    // Find country's id
    const countryTrends = await client.get('trends/available', {})
    const countryId = countryTrends.find(e => e.name === 'United States').woeid

    // Pick a random top trend for this country
    const placeTrends = await client.get('trends/place', { id: countryId })
    const selectedTrend = placeTrends[0].trends[Math.floor(Math.random()*placeTrends[0].trends.length)].name
    console.log(`Trend selected : ${selectedTrend}`)
    content += selectedTrend

    // Encode Image from url
    const base64Image = await encodeImage(`${image.url}?w=700`)
    console.log(`Image encoded : ${image.url}`)

    // Upload and get media's id
    const uploadMedia = await client.post('media/upload', { media_data: base64Image })
    const mediaId = uploadMedia.media_id_string
    console.log('Image uploaded')

    // Post content with media
    await client.post('statuses/update', { status: content, media_ids: mediaId })
    console.log('Post uploaded')
    console.log('Twitter bot OFF : success')
  } catch(error) {
    console.log(`Twitter bot OFF : ${JSON.stringify(error)}`)
  }
}
