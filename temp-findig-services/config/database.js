require('dotenv').config();
const mysqlConnectionPOS = require('mysql');
const util = require('util')

const configDb = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    maxIdle: 3,
    idleTimeout: 60000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

const pool = mysqlConnectionPOS.createPool(configDb);

pool.query("SELECT 5+0 AS solution", function (error, results, fields) {
  if (error) {
    console.log('findig service connection error:', error)
    throw error
  }
  console.log("Connect old mysql ip: ", configDb.host)
  console.log("Connect old mysql version: ", results[0].solution)
  console.log('##### ##### #####')
})

pool.query = util.promisify(pool.query)

module.exports = { pool };
