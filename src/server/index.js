const database = require('./utils/database.js');
const crontab = require('./utils/crontab.js');
const api = require('./api/images.routes.js');

const server = require('./utils/middleware.js');
const port = process.env.PORT || 8080;

database();
api(server);
crontab();

server.listen(port, () => console.log(`Listening on port ${port} !`));
