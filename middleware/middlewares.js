

const disallowNonGet = (req, res, next) => {
    if (req.method !== 'GET') {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('X-Content-Type-Options', 'nosniff');
      res.set('Content-Length', '0');
      res.set('Date', new Date().toUTCString());
      return res.status(405).send();
    }
    next();
  };
  
  module.exports = {
    disallowNonGet,
    // disallowNonHealthz
  };
  