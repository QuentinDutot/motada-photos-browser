const axios = require('axios')
const Images = require('../api/images.model.js')

module.exports = async () => {
  const items = 100

  const randomImages = await Images.aggregate([
    { $sample: { size: items } },
    { $project: { _id: true, url: true } },
    { $limit: items },
  ])

  randomImages.forEach((randomImage) => {
    axios.head(randomImage.url).then(async () => {

      // delete duplicate images
      const similarImages = await Images.find({ url: randomImage.url })
      const duplicateImages = similarImages.filter(similarImage => similarImage._id.toString() != randomImage._id.toString())
      duplicateImages.forEach(async (duplicateImage) => {
        await Images.findByIdAndRemove(duplicateImage._id)
        console.log('duplicate image deleted:', duplicateImage._id)
      })

    }).catch(async () => {

      // delete unreachable image
      await Images.findByIdAndRemove(randomImage._id)
      console.log('unreachable image deleted:', randomImage._id)
    
    })
  })
}
