const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/users');
const token = require('../helpers/checkToken');
const fileUpload = require('../helpers/fileUpload');

userRouter.post('/createJamaah', fileUpload, userController.createUser);
userRouter.get('/getDataGroup', userController.selectUserByDateDeparture);
userRouter.get('/getTotal', userController.countUserByDateDeparture);
userRouter.get('/getProfile', token, userController.getProfile);

module.exports = userRouter;