const express = require('express');
const mainRouter = express.Router();
const authRouter = require('./auth');
const welcomeRouter = require('./welcome');

// endpoint handler
mainRouter.use('/auth', authRouter);
mainRouter.use('/welcome', welcomeRouter);

module.exports = mainRouter;