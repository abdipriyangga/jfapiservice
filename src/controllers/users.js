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
    // console.log("date: ", data);
    await userModel.countUserByDeparture([data], (err, results, _fields) => {
      if (!err) {
        userModel.getUserByDeparture([data], (err, dataUser, _fields) => {
          const fixData = {
            dataUser,
            ...results,
          }
          console.log("FIXDATA: ", fixData);
          return response(res, 200, 'Get data successfully!', fixData.rows);
        })
        // return response(res, 200, 'Get data successfully!', results.rows);
      }
      else {
        return response(res, 400, 'Cannot get data!', err);
      }
    })
  } catch (error) {
    return response(res, 500, 'An error occured!', error);
  }
}
