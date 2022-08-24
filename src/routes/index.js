const express = require('express');
const mainRouter = express.Router();
const authRouter = require('./auth');
const categoryRouter = require('./category');
const notificationRouter = require('./notification');
const userRouter = require('./users');
const welcomeRouter = require('./welcome');
const { APP_UPLOAD_ROUTE, APP_UPLOAD_PATH } = process.env;
// endpoint handler
mainRouter.use(APP_UPLOAD_ROUTE, express.static(APP_UPLOAD_PATH));
mainRouter.use('/auth', authRouter);
mainRouter.use('/dataJamaah', userRouter);
mainRouter.use('/welcome', welcomeRouter);
// mainRouter.use('/notification', notificationRouter);
mainRouter.use('/category', categoryRouter);
module.exports = mainRouter;