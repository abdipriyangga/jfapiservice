const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/users');
const fileUpload = require('../helpers/fileUpload');

userRouter.post('/createJamaah', fileUpload, userController.createUser);
userRouter.get('/getDataGroup', userController.selectUserByDateDeparture);
userRouter.get('/getTotal', userController.countUserByDateDeparture);

module.exports = userRouter;