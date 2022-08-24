const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/users');
const token = require('../helpers/checkToken');
const fileUpload = require('../helpers/fileUpload');
console.log("TOKEN FROM ROUTER: ", token);
userRouter.post('/createJamaah', fileUpload, userController.createUser);
userRouter.post('/addMemo', token, userController.addMemo);
userRouter.get('/logout', token, userController.logout);
userRouter.get('/getDataGroup', userController.selectUserByDateDeparture);
userRouter.get('/getTotal', userController.countUserByDateDeparture);
userRouter.get('/getProfile', token, userController.getProfile);
userRouter.get('/getMemo', token, userController.getMemo);

module.exports = userRouter;