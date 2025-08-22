require("dotenv").config()

let mysqlConnectionBor = null

if (process.env.IS_OLD_MYSQL5_BOR === "Y") {
  mysqlConnectionBor = require("mysql")
  console.log('old db use bor mysql5')
} else {
  mysqlConnectionBor = require("mysql2")
  console.log('new db use bor mysql8')
}

const util = require('util')

const configBor = {
  host: process.env.BOR_DB_HOST,
  user: process.env.BOR_DB_USER,
  password: process.env.BOR_DB_PASSWORD,
  database: process.env.BOR_DB_NAME,
  port: process.env.BOR_DB_PORT,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0,
  connectTimeout: 10000,
  maxIdle: 3,
  idleTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
}

const poolBor = mysqlConnectionBor.createPool(configBor);

poolBor.query("SELECT 5+0 AS solution", function (error, results, fields) {
  if (error) {
    console.log('mybor connection error:', error)
    throw error
  }
  console.log("Connect bor old mysql ip: ", poolBor.host)
  console.log("Connect bor old mysql version: ", results[0].solution)
  console.log('##### ##### #####')
})

poolBor.query = util.promisify(poolBor.query)

module.exports = poolBor
