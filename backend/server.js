const http = require('http');
const app = require('./app');
require('dotenv').config({ path: './config/.env' });

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
