require("dotenv").config()

const util = require('util')

const mysqlConnectionPOS = process.env.IS_OLD_MYSQL5_POS === "Y" 
  ? require("mysql") 
  : require("mysql2")

console.log(process.env.IS_OLD_MYSQL5_POS === "Y" ? 'POS: Using MySQL 5' : 'POS: Using MySQL 8')

const configDb = {
  host: process.env.MYSQL5_DB_HOST,
  user: process.env.MYSQL5_DB_USER,
  password: process.env.MYSQL5_DB_PASSWORD,
  database: process.env.MYSQL5_DB_NAME,
  port: process.env.MYSQL5_DB_PORT,
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

const poolPOS = mysqlConnectionPOS.createPool(configDb)
poolPOS.query = util.promisify(poolPOS.query)

const testConnection = async () => {
  try {
    await poolPOS.query("SELECT 1 as connected")
    console.log(`POS Database connected successfully to: ${configDb.host}:${configDb.port}/${configDb.database}`)
  } catch (error) {
    console.error('POS Database connection failed:', error.message)
  }
}

testConnection()

module.exports = poolPOS
