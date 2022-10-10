const pool = require('../helpers/queries');
const { promisify } = require('util');
const execPromise = promisify(pool.query).bind(pool);
const user = 'users';
const firebase = 'token_firebase';



exports.createTokenFirebaseUser = (data) => {
  return execPromise(`INSERT INTO ${firebase} (token, user_id) values ($1, $2)`, data);
}

exports.createIsLogin = (data) => {
  return execPromise(`UPDATE ${user} SET is_login = $1 where number_visa = $2 `, data);
}

exports.getUserByVisaNumber = (numberVisa) => {
  return execPromise(`SELECT id, number_visa, role, group_name, is_login from ${user} where number_visa = $1`, numberVisa)
};

exports.getUserById = (numberVisa) => {
  return execPromise(`SELECT id from ${user} where number_visa = $1`, numberVisa)
};

