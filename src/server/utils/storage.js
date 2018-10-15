const dbLow = require('lowdb');
const dbFileSync = require('lowdb/adapters/FileSync');

const dbAdapter = new dbFileSync('database.json');
const storage = dbLow(dbAdapter);

storage.defaults({ images: [] }).write();

module.exports = storage;
