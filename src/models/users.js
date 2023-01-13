const pool = require('../helpers/queries');
const { promisify } = require('util');
const execPromise = promisify(pool.query).bind(pool);
const user = 'users';
const memo = 'memo';

exports.countUserByDeparture = (cb) => {
  return execPromise(`Select TO_CHAR(${user}.departure :: DATE, 'mm/dd/yyyy') as departure, count(departure) as total from ${user} group by ${user}.departure `, cb);
};

exports.getUserByDeparture = (dateDeparture, cb) => {
  return execPromise(`Select id, package_name, fullname, passpor_number, nationality, TO_CHAR(${user}.departure :: DATE, 'mm/dd/yyyy') as departure, link_group, group_name, picture, gender, email, phone_number from ${user} where departure = $1`, dateDeparture, cb);
};

exports.createUser = (data) => {
  return execPromise(`INSERT INTO ${user} (departure, passpor_number, nationality, role,  group_name,  link_group, picture, hotel_mekkah, hotel_madinah, phone_number, package_name, fullname, email, gender) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`, data);
}

exports.getUserProfile = (id, cb) => {
  return execPromise(`Select id, TO_CHAR(${user}.departure :: DATE, 'mm/dd/yyyy') as departure, email,passpor_number, package_name, fullname, phone_number, gender, nationality, link_group, group_name, picture, hotel_mekkah, hotel_madinah from ${user} where id = $1`, id, cb);
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
exports.logoutUsers = (data, cb) => {
  return execPromise(`UPDATE ${user} SET is_login = $1 where id = $2`, data, cb);
}