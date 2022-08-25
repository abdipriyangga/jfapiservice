const pool = require('../helpers/queries');
const { promisify } = require('util');
const execPromise = promisify(pool.query).bind(pool);
const user = 'users';
const memo = 'memo';

exports.countUserByDeparture = (cb) => {
  return execPromise(`Select TO_CHAR(${user}.departure :: DATE, 'mm/dd/yyyy') as departure, count(departure) as total from ${user} group by ${user}.departure `, cb);
};

exports.getUserByDeparture = (dateDeparture, cb) => {
  return execPromise(`Select id, number_visa, package_name, fullname, stay_duration, paspor_number, nationality, TO_CHAR(${user}.departure :: DATE, 'dd/mm/yyyy') as departure, visa_type, TO_CHAR(${user}.out_date :: DATE, 'dd/mm/yyyy') as out_date, TO_CHAR(${user}.until_date :: DATE, 'dd/mm/yyyy') as until_date, link_group, group_name, picture, id_category from ${user} where departure = $1`, dateDeparture, cb);
};

exports.createUser = (data) => {
  return execPromise(`INSERT INTO ${user} (number_visa, role, package_name, fullname, stay_duration, paspor_number, nationality, departure, visa_type, out_date, until_date, link_group, id_category, group_name, picture, hotel_mekkah, hotel_madinah) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`, data);
}

exports.getUserProfile = (id, cb) => {
  return execPromise(`Select id, number_visa, package_name, fullname, stay_duration, paspor_number, nationality, TO_CHAR(${user}.departure :: DATE, 'dd/mm/yyyy') as departure, visa_type, TO_CHAR(${user}.out_date :: DATE, 'dd/mm/yyyy') as out_date, TO_CHAR(${user}.until_date :: DATE, 'dd/mm/yyyy') as until_date, link_group, group_name, picture, id_category, hotel_mekkah, hotel_madinah from ${user} where id = $1`, id, cb);
};

exports.addMemo = (data, cb) => {
  return execPromise(`INSERT INTO ${memo} (memo_message, created_by) values ($1, $2)`, data, cb);
}
exports.getMemo = (cb) => {
  return execPromise(`SELECT memo_message, created_by,TO_CHAR(${memo}.created_at :: DATE, 'dd/mm/yyyy') as created_at from ${memo}`, cb);
}

exports.deleteByDeparture = (data, cb) => {
  return execPromise(`DELETE from ${user} Where departure = $1`, data, cb);
}