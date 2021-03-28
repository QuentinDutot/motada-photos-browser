const algolia = require('../utils/algolia.js')
const Images = require('../api/images.model.js')

module.exports = async () => {

  const randomImages = await Images.getSamples(100)

  const ids = randomImages.map(({ _id }) => _id)
  const objects = randomImages.map(({ _id, title }) => ({ objectID: _id, title }))

  algolia('images')
    .saveObjects(objects)
    .then(console.log('images indexed on algolia:', ids))
    .catch(console.error)
}
