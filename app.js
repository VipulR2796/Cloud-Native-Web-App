require('dotenv').config();
const { config } = require('dotenv');
const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const authMiddleware = require('./middleware/authMiddleware');

const middlewares = require('./middleware/middlewares');
const healthCheckRouter = require('./controllers/healthCheckController');
const assignmentRouter = require('./controllers/assignmentController');
const routes = require('./routes');
const { Sequelize } = require('sequelize');
const models = require('./models'); 


config();

const db = require('./dbStartup')();
const app = express();
app.use(express.json());
//route
routes(app);

module.exports = app;


