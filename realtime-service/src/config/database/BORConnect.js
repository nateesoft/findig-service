require("dotenv").config()

const util = require('util')

const mysqlConnectionBor = process.env.IS_OLD_MYSQL5_BOR === "Y"
  ? require("mysql")
  : require("mysql2")

console.log(process.env.IS_OLD_MYSQL5_BOR === "Y" ? 'BOR: Using MySQL 5' : 'BOR: Using MySQL 8')

const configBor = {
  host: process.env.BOR_DB_HOST,
  user: process.env.BOR_DB_USER,
  password: process.env.BOR_DB_PASSWORD,
  database: process.env.BOR_DB_NAME,
  port: process.env.BOR_DB_PORT,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0,
  connectTimeout: 30000,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  maxIdle: 3,
  idleTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
}

const poolBor = mysqlConnectionBor.createPool(configBor)
poolBor.query = util.promisify(poolBor.query)

const testConnection = async () => {
  try {
    await poolBor.query("SELECT 1 as connected")
    console.log(`BOR Database connected successfully to: ${configBor.host}:${configBor.port}/${configBor.database}`)
  } catch (error) {
    console.error('BOR Database connection failed:', error.message)
  }
}

testConnection()

module.exports = poolBor
