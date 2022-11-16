const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/users');
const token = require('../helpers/checkToken');
const fileUpload = require('../helpers/fileUpload');

userRouter.post('/createJamaah', fileUpload, userController.createUser);
userRouter.post('/addMemo', token, userController.addMemo);
userRouter.post('/delete', userController.deleteByDeparture);
userRouter.post('/logout', token, userController.logout);
userRouter.post('/getDataGroup', userController.selectUserByDateDeparture);
userRouter.get('/getTotal', userController.countUserByDateDeparture);
userRouter.get('/getProfile', token, userController.getProfile);
userRouter.get('/getMemo', token, userController.getMemo);
userRouter.get('/getDataJamaahFromClient', userController.getDataJamaahFromClient);

module.exports = userRouter;