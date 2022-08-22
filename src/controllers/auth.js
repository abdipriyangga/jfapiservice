const authModel = require('../models/auth');
const { response } = require('../helpers/response');
const jwt = require('jsonwebtoken');
const { APP_SECRET_KEY } = process.env;



exports.login = async (req, res) => {
  const { numberVisa } = req.body;
  const data = req.body;
  console.log(numberVisa)
  const getIdUser = await authModel.getUserById([numberVisa]);
  const checkNumberVisa = await authModel.getUserByVisaNumber([numberVisa]);
  try {
    if (checkNumberVisa.rowCount < 1) {
      return response(res, 404, "Visa number not found!")
    }
    console.log('data user: ', checkNumberVisa.rows[0]);
    const role = checkNumberVisa.rows[0].role;
    const id = getIdUser.rows[0].id;
    // const jamaah = 'jamaah';
    // console.log(jamaah)
    // const compare = await argon.verify(user.numberVisa, data.numberVisa);
    const token = jwt.sign({ id: checkNumberVisa.rows[0].id, number_visa: checkNumberVisa.rows[0].number_visa, role: checkNumberVisa.rows[0].role }, APP_SECRET_KEY, { expiresIn: '24h' });
    const tokenFirebase = await authModel.createTokenFirebaseUser([data.tokenFirebaseInput, id]);
    console.log("TOJEN", token);
    console.log("TOJEN", tokenFirebase);

    return response(res, 200, 'Login Success!', { token, role, data });
    // if (role !== 'jamaah') {
    //   // if (compare) {
    //   // } else {
    //   //   return response(res, 401, 'Wrong visa number!');
    //   // }
    // } else {
    //   console.log("Hello");
    // }
    // if (user.role === 'tl') {
    //   if (compare) {
    //     const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, APP_SECRET_KEY, { expiresIn: '1h' });
    //     return response(res, 200, 'Login Success!', { token });
    //   } else {
    //     return response(res, 401, 'Wrong email or password!');
    //   }
    // }
  } catch (error) {
    console.log("why error: ", error);
  }
};