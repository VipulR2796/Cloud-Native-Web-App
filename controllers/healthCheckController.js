const mysql = require('mysql2');
const SDC = require('statsd-client');
const logger = require('../config/logger');
const sdc = new SDC({host: process.env.STATSD_HOST, port: process.env.STATSD_PORT});

const checkHealth = (req, res) => {
  
  logger.info(`HTTP ${req.method} ${req.url} ${res.statusCode} Calling healthz get api`);
  sdc.increment('endpoint.user.http.gethealthz');

  if(req.headers['content-length']){
    return res.status(400).send();
  }

  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('X-Content-Type-Options', 'nosniff');
      res.set('Content-Length', '0');
      res.set('Date', new Date().toUTCString());
      
      logger.error(`HTTP ${req.method} ${req.url} ${res.statusCode} Error connecting to database`);
      return res.status(503).send();
    }


    console.log('Connected to database');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Date', new Date().toUTCString());
    res.set('Content-Length', '0');

    return res.status(200).send();
  });
};

module.exports = {
  checkHealth
};
