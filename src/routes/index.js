const express = require('express');
const mainRouter = express.Router();
const authRouter = require('./auth');
const userRouter = require('./users');
const welcomeRouter = require('./welcome');

// endpoint handler
mainRouter.use('/auth', authRouter);
mainRouter.use('/dataJamaah', userRouter);
mainRouter.use('/welcome', welcomeRouter);

module.exports = mainRouter;