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
    // console.log('search', search)
    // const { hits } = await algolia('images').search(search)
    // console.log('hits', hits)
    result = {
      search: await Images.find({ $text: { $search: search } })
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
