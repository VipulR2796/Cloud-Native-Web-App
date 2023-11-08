// const basicAuth = require('express-basic-auth');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const userService = require('../services/userServices');
const SDC = require('statsd-client');
const logger = require('../config/logger');
const sdc = new SDC({host: process.env.STATSD_HOST, port: process.env.STATSD_PORT});

const basicAuth = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Basic")) {
        const base64Credentials = req.headers.authorization.split(" ")[1];
        const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
        const [email, password] = credentials.split(":");
        // const user = await User.findOne({ where: { email } });
        const user = await userService.getUserFromDatabase(email);

        if (!user) {
            logger.error(`HTTP ${req.method} ${req.url} 401 Authentication failed`);
            return res.status(401).json({ message: "Authentication failed" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            console.log("Please give correct Credentials");
            logger.error(`HTTP ${req.method} ${req.url} 401 Authentication failed`);
            return res.status(401).json({ message: "Authentication failed" });
        }

        req.user = user; // Set req.user with the authenticated user information
        next();
    } else {
        logger.error(`HTTP ${req.method} ${req.url} 401 Authentication Header Missing`);
        res.status(401).json({ message: "Authentication header missing" });
    }
};

module.exports = basicAuth;

