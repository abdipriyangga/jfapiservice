const pool = require('../helpers/queries');
const { promisify } = require('util');
const execPromise = promisify(pool.query).bind(pool);
const user = 'users';

exports.countUserByDeparture = (dateDeparture, cb) => {
  return execPromise(`Select departure, count(departure) from ${user} group by ${user}.id HAVING departure = $1`, dateDeparture, cb);
};

exports.getUserByDeparture = (dateDeparture, cb) => {
  return execPromise(`Select * from ${user} where departure = $1`, dateDeparture, cb);
};