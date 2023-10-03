const { app } = require('./app');
const http = require('http');
require('dotenv').config();

var myserver = http.createServer(app);

myserver.listen(process.env.PORT, () => {
  console.log("server is ready")
});

myserver.on('error', (err) => {
  console.error(err.message);
  process.exit(1);
});