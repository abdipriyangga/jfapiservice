const authModel = require('../models/auth');
const { response } = require('../helpers/response');
const jwt = require('jsonwebtoken');
const { APP_SECRET_KEY } = process.env;

exports.login = async (req, res) => {
  const { numberPassport } = req.body;
  const data = req.body;
  const getIdUser = await authModel.getUserById([numberPassport]);
  const checkNumberPassport = await authModel.getUserByPassporNumber([numberPassport]);
  try {
    console.log("DATA", checkNumberPassport.rows[0])
    if (checkNumberPassport.rowCount < 1) {
      return response(res, 404, "Passport number not found!")
    } else {
      if (checkNumberPassport.rows[0].is_login === null || checkNumberPassport.rows[0].is_login === 'false') {
        await authModel.createIsLogin(['true', numberPassport])
        const role = checkNumberPassport.rows[0].role;
        const id = getIdUser.rows[0].id;
        const token = jwt.sign({ id: checkNumberPassport.rows[0].id, paspor_number: checkNumberPassport.rows[0].paspor_number, role: checkNumberPassport.rows[0].role, group_name: checkNumberPassport.rows[0].group_name }, APP_SECRET_KEY, { expiresIn: '14 days' });

        return response(res, 200, 'Login Success!', { token, role, data });
      } else {
        return response(res, 400, 'Sorry you still Login in another device!');
      }

    }

  } catch (error) {
    return response(res, 500, "An error occured!", error);
  }
};