const adminModel = require('../models/admin');
const { response } = require('../helpers/response');
const path = require('path');
const argon2 = require('argon2');
const { APP_SECRET_KEY } = process.env;
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  const data = req.body;
  try {
    data.pictures = path.join(process.env.APP_UPLOAD_ROUTE, req.file.filename);
    const password = data.password;
    const hash = await argon2.hash(password);
    await adminModel.createUser([data.fullname, data.role, data.pictures, hash]);
    return response(res, 200, 'Create user has been successfully!', data);
  } catch (error) {
    return response(res, 500, "An error occured!", error);
  }
};


exports.login = async (req, res) => {
  const data = req.body;
  console.log("DATA: ", data)
  const checkProfile = await adminModel.getUserProfile([data.fullname]);
  console.log("CEK: ", checkProfile.rows[0]);
  if (checkProfile.rowCount < 1) {
    return response(res, 404, "user not found!")
  } else {
    const hashPassword = checkProfile.rows[0].password;
    const compare = await argon2.verify(hashPassword, data.password);
    console.log("Compare: ", compare);
    if (compare) {
      const role = checkProfile.rows[0].role;
      const token = jwt.sign({ id: checkProfile.rows[0].id, fullname: checkProfile.rows[0].fullname, role: checkProfile.rows[0].role }, APP_SECRET_KEY, { expiresIn: '12h' });
      return response(res, 200, 'Login Admin Success!', { token, role });
    } else {
      return response(res, 401, 'Wrong email or password!');
    }
  }
  // try {

  // } catch (error) {
  //   console.log("why error: ", error);
  // }
};