const path = require('path');
const server = require('./utils/middleware.js');
const database = require('./utils/storage.js');

server.use('/api', require('./api.js')(database));

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../dist', 'index.html'));
});

require('./utils/crontab.js')(database);

server.listen(8080, () => console.log('Listening on port 8080!'));
