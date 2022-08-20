const userModel = require('../models/users');
const { response } = require('../helpers/response');

exports.selectUserByDateDeparture = async (req, res) => {
  const { dateDeparture } = req.body;
  const [day, month, year] = dateDeparture.split('/');
  const data = new Date(
    +year,
    +month - 1,
    +day,
  ).toLocaleDateString();
  try {
    await userModel.getUserByDeparture([data], (err, dataUser, _fields) => {
      if (!err) {
        return response(res, 200, 'Get data successfully!', dataUser.rows);
      }
      else {
        return response(res, 400, 'Cannot get data!', err);
      }
    })
  } catch (error) {
    return response(res, 500, 'An error occured!', error);
  }
}

exports.countUserByDateDeparture = async (req, res) => {
  try {
    await userModel.countUserByDeparture((err, totalUser, _fields) => {
      if (!err) {
        return response(res, 200, 'Get data successfully!', totalUser.rows);
      }
      else {
        return response(res, 400, 'Cannot get data!', err);
      }
    })
  } catch (error) {
    return response(res, 500, 'An error occured!', error);
  }
}
