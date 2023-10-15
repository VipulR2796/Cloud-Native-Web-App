const { use } = require('chai');
const express = require('express');
const healthCheckController = require( '../controllers/healthCheckController');
// const authMiddleware = require( '../middleware/authMiddleware');
const middlewares = require('../middleware/middlewares');

const router = express.Router();

router.route('/')
    // use(middlewares.disallowNonGet)
    .get(middlewares.disallowNonGet, healthCheckController.checkHealth)
    .put(middlewares.disallowNonGet)
    .post(middlewares.disallowNonGet)
    .patch(middlewares.disallowNonGet)
    .delete(middlewares.disallowNonGet);


module.exports = router;