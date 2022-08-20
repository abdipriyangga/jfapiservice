const pool = require('../helpers/queries');
const { promisify } = require('util');
const execPromise = promisify(pool.query).bind(pool);
const user = 'users';

exports.createUser = (data) => {
  return execPromise(`INSERT INTO ${user} (number_visa, role, package_name, fullname, stay_duration, paspor_number, nationality, departure, visa_type, out_date, until_date) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`, data);
}

exports.createTokenFirebaseUser = (tokenFirebase, cb) => {
  return execPromise(`INSERT INTO ${user} (token_firebase) values ($1)`, tokenFirebase, cb);
}

exports.getUserByVisaNumber = (numberVisa) => {
  return execPromise(`SELECT id, number_visa, role from ${user} where number_visa = $1`, numberVisa)
};

