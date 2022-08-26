const Pool = require('pg').Pool
const pool = new Pool({
  user: 'ubuntu',
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: 'Z43f5r0an218218~',
  port: process.env.PORT_DB,
})

pool.connect(function (err, client, done) {
  if (err) {
    console.log('not able to get connection ' + err);
  } else {
    console.log('connected!')
  }
});
module.exports = pool;