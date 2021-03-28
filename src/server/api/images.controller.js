const algolia = require('../utils/algolia.js')
const Images = require('./images.model.js')

exports.find = async (req, res) => {
  const { query } = req
  const { random, search } = query
  let result = false

  // api/images?count
  if (Object.prototype.hasOwnProperty.call(query, 'count')) {
    result = {
      count: await Images.estimatedDocumentCount()
    }
  }

  // api/images?random=3
  if (Object.prototype.hasOwnProperty.call(query, 'random')) {
    result = {
      random: await Images.getSamples(random)
    }
  }
  
  // api/images?search=beautiful car
  if (Object.prototype.hasOwnProperty.call(query, 'search')) {
    const { hits } = await algolia('images').search(search, { page: 0, hitsPerPage: 1000 })
    const ids = hits.map(({ objectID }) => objectID)
    result = {
      search: await Images.find({ _id: { $in: ids } })
    }
  }

  res.send(JSON.stringify(result))
}

exports.update = async (req, res) => {
  const { params, body } = req
  let result = false

  if (params.id) {
    const image = await Images.findByIdAndUpdate(params.id, body, { new: true })
    if (image) result = true
  }

  res.send(JSON.stringify(result))
}

exports.delete = async (req, res) => {
  const { params } = req
  let result = false

  if (params.id) {
    const image = await Images.cleanDelete(params.id)
    if (image) result = true
  }

  res.send(JSON.stringify(result))
}
