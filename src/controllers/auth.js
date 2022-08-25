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
    }
    console.log('data user: ', checkNumberVisa.rows[0]);
    const role = checkNumberVisa.rows[0].role;
    const id = getIdUser.rows[0].id;
    const token = jwt.sign({ id: checkNumberVisa.rows[0].id, number_visa: checkNumberVisa.rows[0].number_visa, role: checkNumberVisa.rows[0].role, group_name: checkNumberVisa.rows[0].group_name }, APP_SECRET_KEY, { expiresIn: '12h' });
    console.log("TOJEN", token);
    // const tokenFirebase = await authModel.createTokenFirebaseUser([data.tokenFirebaseInput, id]);
    // console.log("TOJEN", tokenFirebase);

    return response(res, 200, 'Login Success!', { token, role, data });
  } catch (error) {
    console.log("why error: ", error);
  }
};