const pool = require('../helpers/queries');
const { promisify } = require('util');
const execPromise = promisify(pool.query).bind(pool);
const category = 'categories';

exports.createCategory = (data, cb) => {
  return execPromise(`INSERT into ${category} (category_name) values ($1) `, data, cb);
};

exports.getAllCategory = (cb) => {
  return execPromise(`Select * from ${category}`, cb);
};