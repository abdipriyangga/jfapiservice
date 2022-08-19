const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/users');

userRouter.get('/getDataGroup', userController.selectUserByDateDeparture);
// authRouter.post('/login', authController.login);
// authRouter.post('/forgot-password', authController.forgotPassword); 

module.exports = userRouter;