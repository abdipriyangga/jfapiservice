const pool = require('../helpers/queries');
const { promisify } = require('util');
const execPromise = promisify(pool.query).bind(pool);
const user = 'users';
const firebase = 'token_firebase';



exports.createTokenFirebaseUser = (data) => {
  return execPromise(`INSERT INTO ${firebase} (token, user_id) values ($1, $2)`, data);
}

exports.createIsLogin = (data) => {
  return execPromise(`UPDATE ${user} SET is_login = $1 where paspor_number = $2 `, data);
}

exports.getUserByVisaNumber = (passportNumber) => {
  return execPromise(`SELECT id, paspor_number, role, group_name, is_login from ${user} where paspor_number = $1`, passportNumber)
};

exports.getUserById = (passportNumber) => {
  return execPromise(`SELECT id from ${user} where paspor_number = $1`, passportNumber)
};

