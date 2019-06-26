module.exports = () => {
  const mongoose = require('mongoose');

  const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/motada';
  const depreciations = {
    useNewUrlParser: true,
    useFindAndModify: false
  };

  mongoose.Promise = global.Promise;

  mongoose.connect(url, depreciations)
    .then(() => console.log('Database connected !'))
    .catch(() => console.log('Error connecting to database !'));
}