const express = require('express');
const healthCheckController = require( '../controllers/healthCheckController');
// const authMiddleware = require( '../middleware/authMiddleware');
const middlewares = require('../middleware/middlewares');

const router = express.Router();

router.route('/')
    .get(middlewares.disallowNonGet, healthCheckController.checkHealth);


module.exports = router;