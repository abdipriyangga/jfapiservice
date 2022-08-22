const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/category');

categoryRouter.post('/createCategory', categoryController.createCategory);
categoryRouter.get('/categories', categoryController.getAllCategory);

module.exports = categoryRouter;