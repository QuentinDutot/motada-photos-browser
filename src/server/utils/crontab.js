const cron = require('node-cron')

const scraping = require('../crons/scraping.js')
const cleaning = require('../crons/cleaning.js')

module.exports = () => {

  // scraping cron
  cron.schedule(process.env.SCRAPING_CRON || '00 */2 * * *', scraping)

  // cleaning cron
  cron.schedule(process.env.CLEANING_CRON || '00 */2 * * *', cleaning)

}
