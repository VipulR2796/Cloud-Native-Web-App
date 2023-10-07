const mysql = require('mysql2');

const checkHealth = (req, res) => {
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
