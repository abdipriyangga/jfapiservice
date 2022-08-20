const authModel = require('../models/auth');
const { response } = require('../helpers/response');
const argon = require('argon2');
const jwt = require('jsonwebtoken');
const { APP_SECRET_KEY } = process.env;

exports.createUser = async (req, res) => {
  const data = req.body;
  data.role = 'jamaah';
  const str = data.departure;
  const dataOutDate = data.outDate;
  const dataUntilDate = data.untilDate;

  const [day, month, year] = str.split('/');
  const [outDay, outMonth, outYear] = dataOutDate.split('/');
  const [untilDay, untilMonth, untilYear] = dataUntilDate.split('/');
  const dateDeparture = new Date(
    +year,
    +month - 1,
    +day,
  ).toLocaleDateString();
  const dateOut = new Date(
    +outYear,
    +outMonth - 1,
    +outDay,
  ).toLocaleDateString();
  const dateUntil = new Date(
    +untilYear,
    +untilMonth - 1,
    +untilDay,
  ).toLocaleDateString();
  console.log("DATE Depart: ", dateDeparture);
  console.log("DATE OUT: ", dateOut);
  console.log("DATE Until: ", dateUntil);
  const checkNumberVisa = await authModel.getUserByVisaNumber([data.numberVisa]);
  console.log(checkNumberVisa)
  if (checkNumberVisa.rowCount > 0) {
    return response(res, 401, "Sorry visa number already exist!")
  }
  await authModel.createUser([data.numberVisa, data.role, data.packageName, data.fullname, data.stayDuration, data.pasporNumber, data.nationality, dateDeparture, data.visaType, dateOut, dateUntil]);

  return response(res, 200, 'Create user has been successfully!', data);
  // if (data.numberVisa) {
  //   // data.numberVisa = await argon.hash(data.numberVisa);
  //   data.role = 'jamaah';
  //   await authModel.createUser([data.numberVisa, data.role]);
  //   return response(res, 200, 'Create user has been successfully!', data);
  // } else {
  //   return response(res, 401, 'Sorry visa number is not valid!');
  // }
};

exports.login = async (req, res) => {
  const { numberVisa } = req.body;
  console.log(numberVisa)
  try {
    const { tokenFirebaseInput } = req.body;
    const checkNumberVisa = await authModel.getUserByVisaNumber([numberVisa]);
    const tokenFirebase = await authModel.createTokenFirebaseUser(tokenFirebaseInput);
    if (checkNumberVisa.rowCount < 1) {
      return response(res, 404, "Visa number not found!")
    }
    console.log('data user: ', checkNumberVisa.rows[0]);
    const role = checkNumberVisa.rows[0].role;

    // const jamaah = 'jamaah';
    // console.log(jamaah)
    // const compare = await argon.verify(user.numberVisa, data.numberVisa);
    const token = jwt.sign({ id: checkNumberVisa.rows[0].id, number_visa: checkNumberVisa.rows[0].number_visa, role: checkNumberVisa.rows[0].role }, APP_SECRET_KEY, { expiresIn: '24h' });
    console.log("TOJEN", token);

    return response(res, 200, 'Login Success!', { token, role, tokenFirebase });
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