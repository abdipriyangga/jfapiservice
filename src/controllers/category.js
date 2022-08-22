const categoryModel = require('../models/category');
const { response } = require('../helpers/response');

exports.createCategory = async (req, res) => {
  const data = req.body;
  try {
    await categoryModel.createCategory([data.categoryName], (err, _fields) => {
      if (!err) {
        return response(res, 200, 'Create Successfully!', data);
      } else {
        return response(res, 400, 'Sorry cannot add category!', err);
      }
    })
  } catch (error) {
    return response(res, 500, 'An error occured!', error);
  }
}

exports.getAllCategory = async (req, res) => {
  const data = req.body;
  try {
    await categoryModel.getAllCategory((err, results, _fields) => {
      if (!err) {
        return response(res, 200, 'Get data Successfully!', results.rows);
      } else {
        return response(res, 400, 'Sorry cannot get data!', err);
      }
    })
  } catch (error) {
    return response(res, 500, 'An error occured!', error);
  }
}

