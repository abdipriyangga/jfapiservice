const authModel = require('../models/auth');
const { response } = require('../helpers/response');
const jwt = require('jsonwebtoken');
const { APP_SECRET_KEY } = process.env;

exports.login = async (req, res) => {
  const { numberVisa } = req.body;
  const data = req.body;
  const getIdUser = await authModel.getUserById([numberVisa]);
  const checkNumberVisa = await authModel.getUserByVisaNumber([numberVisa]);
  try {
    if (checkNumberVisa.rowCount < 1) {
      return response(res, 404, "Visa number not found!")
    } else {
      if (checkNumberVisa.rows[0].is_login === null) {
        await authModel.createIsLogin(['true', numberVisa])
        const role = checkNumberVisa.rows[0].role;
        const id = getIdUser.rows[0].id;
        const token = jwt.sign({ id: checkNumberVisa.rows[0].id, number_visa: checkNumberVisa.rows[0].number_visa, role: checkNumberVisa.rows[0].role, group_name: checkNumberVisa.rows[0].group_name }, APP_SECRET_KEY, { expiresIn: '13d' });
        // const tokenFirebase = await authModel.createTokenFirebaseUser([data.tokenFirebaseInput, id]);
        // console.log("TOJEN", tokenFirebase);
        return response(res, 200, 'Login Success!', { token, role, data });
      } else {
        return response(res, 400, 'Sorry you still Login in another device!');
      }

    }

  } catch (error) {
    console.log("why error: ", error);
  }
};