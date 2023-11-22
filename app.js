require('dotenv').config();
const { config } = require('dotenv');
const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const authMiddleware = require('./middleware/authMiddleware');




const lynx = require('lynx');

const middlewares = require('./middleware/middlewares');
const healthCheckRouter = require('./controllers/healthCheckController');
const assignmentRouter = require('./controllers/assignmentController');
const routes = require('./routes');
// const { Sequelize } = require('sequelize');
const models = require('./models'); 


config();

const { sequelize } = require('./dbStartup');
const SDC = require('statsd-client');
const logger = require('./config/logger');
const sdc = new SDC({host: process.env.STATSD_HOST, port: process.env.STATSD_PORT});

// const db = require('./dbStartup')();
const app = express();


app.use(express.json());
app.get('/healthz', (req, res) => {

    logger.info(`HTTP ${req.method} ${req.url} ${res.statusCode} Calling healthz get api`);
    sdc.increment('endpoint.user.http.gethealthz');

    if(req.headers['content-length']){
        res.status(400).send();
    }

    else if (sequelize && sequelize.authenticate) {
        console.log('Connected to database');
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('X-Content-Type-Options', 'nosniff');
        res.set('Date', new Date().toUTCString());
        res.set('Content-Length', '0');
    
        res.status(200).send();
    } else {
        console.error('Error connecting to database:', err);
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('X-Content-Type-Options', 'nosniff');
        res.set('Content-Length', '0');
        res.set('Date', new Date().toUTCString());
        
        logger.error(`HTTP ${req.method} ${req.url} ${res.statusCode} Error connecting to database`);
        res.status(503).send();
    }
  });

//route
routes(app);
module.exports = app;


