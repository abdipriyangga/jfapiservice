const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/admin');
const fileUpload = require('../helpers/fileUpload');
const cors = require('cors');

adminRouter.post('/create', fileUpload, adminController.createUser);
adminRouter.post('/login', adminController.login);
adminRouter.post('/downloadPdf', adminController.downloadPdf);
adminRouter.post('/downloadFiles', cors({ exposedHeaders: ['Content-Disposition'], }), adminController.downloadFile);


module.exports = adminRouter;