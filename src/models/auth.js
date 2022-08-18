const pool = require('../helpers/queries');
const { promisify } = require('util');
const execPromise = promisify(pool.query).bind(pool);
const user = 'users';

exports.createUser = (data) => {
  return execPromise(`INSERT INTO ${user} (number_visa, role) values ($1,$2)`, data);
}

exports.getUserByVisaNumber = (numberVisa) => {
  return execPromise(`SELECT id, number_visa, role from ${user} where number_visa = $1`, numberVisa)
};

