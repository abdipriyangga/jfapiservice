const pool = require('../helpers/queries');
const { promisify } = require('util');
const execPromise = promisify(pool.query).bind(pool);
const table = 'admin';

exports.createUser = (data) => {
  return execPromise(`INSERT INTO ${table} (fullname, role, picture, password) values ($1,$2,$3,$4)`, data);
}

exports.getUserProfile = (data) => {
  return execPromise(`Select id, fullname, role, password, picture, TO_CHAR(${table}.created_at :: DATE, 'dd/mm/yyyy') as created_at, TO_CHAR(${table}.updated_at :: DATE, 'dd/mm/yyyy') as updated_at from ${table} where fullname = $1`, data);
};
