const cron = require('node-cron')

const scraping = require('../crons/scraping.js')
const cleaning = require('../crons/cleaning.js')
const indexing = require('../crons/indexing.js')

module.exports = () => {

  // scraping cron
  cron.schedule(process.env.SCRAPING_CRON || '00 */2 * * *', scraping)

  // cleaning cron
  cron.schedule(process.env.CLEANING_CRON || '00 */2 * * *', cleaning)

  // indexing cron
  cron.schedule(process.env.INDEXING_CRON || '00 */2 * * *', indexing)

}
