const algoliasearch = require('algoliasearch')

const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_KEY)

module.exports = client.initIndex
