const path = require('path');
const server = require('./utils/middleware.js');
const database = require('./utils/storage.js');
const port = process.env.PORT || 8080;

server.use('/api', require('./api.js')(database));

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../dist', 'index.html'));
});

require('./utils/crontab.js')(database);

server.listen(port, () => console.log(`Listening on port ${port} !`));
