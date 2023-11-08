
const SDC = require('statsd-client');
const logger = require('../config/logger');
const sdc = new SDC({host: process.env.STATSD_HOST, port: process.env.STATSD_PORT});

const disallowNonGet = (req, res, next) => {
    if (req.method !== 'GET') {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('X-Content-Type-Options', 'nosniff');
      res.set('Content-Length', '0');
      res.set('Date', new Date().toUTCString());
      logger.error(`HTTP ${req.method} ${req.url} 405 Method not allowed`);
      return res.status(405).send();
    }
    next();
  };
  
  module.exports = {
    disallowNonGet,
    // disallowNonHealthz
  };
  