const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/admin');
const token = require('../helpers/checkToken');
const fileUpload = require('../helpers/fileUpload');
console.log("TOKEN FROM ROUTER: ", token);

adminRouter.post('/create', fileUpload, adminController.createUser);
adminRouter.post('/login', adminController.login);
adminRouter.get('/downloadPdf', adminController.downloadPdf);


module.exports = adminRouter;