const Images = require('./images.controller.js')

module.exports = (router) => {

  router.get('/api/images/:id?', Images.find)
  router.patch('/api/images/:id?', Images.update)
  router.delete('/api/images/:id?', Images.delete)
  
}
