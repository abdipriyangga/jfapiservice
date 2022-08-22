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

exports.createUser = (data) => {
  return execPromise(`INSERT INTO ${user} (number_visa, role, package_name, fullname, stay_duration, paspor_number, nationality, departure, visa_type, out_date, until_date, link_grup, id_category, group_name, picture) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`, data);
}