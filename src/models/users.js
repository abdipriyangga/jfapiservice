const pool = require('../helpers/queries');
const { promisify } = require('util');
const execPromise = promisify(pool.query).bind(pool);
const user = 'users';

exports.countUserByDeparture = (cb) => {
  return execPromise(`Select departure, count(departure) as total from ${user} group by ${user}.departure`, cb);
};

exports.getUserByDeparture = (dateDeparture, cb) => {
  return execPromise(`Select * from ${user} where departure = $1`, dateDeparture, cb);
};