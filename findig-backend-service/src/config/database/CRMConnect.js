require("dotenv").config()

const util = require('util')

const mysqlConnectionCrm = process.env.IS_OLD_MYSQL5_CRM === "Y"
  ? require("mysql")
  : require("mysql2")

console.log(process.env.IS_OLD_MYSQL5_CRM === "Y" ? 'CRM: Using MySQL 5' : 'CRM: Using MySQL 8')

const configCrm = {
  host: process.env.MYSQL5_CRM_DB_HOST,
  user: process.env.MYSQL5_CRM_DB_USER,
  password: process.env.MYSQL5_CRM_DB_PASSWORD,
  database: process.env.MYSQL5_CRM_DB_NAME,
  port: process.env.MYSQL5_CRM_DB_PORT,
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

const poolCrm = mysqlConnectionCrm.createPool(configCrm)
poolCrm.query = util.promisify(poolCrm.query)

const testConnection = async () => {
  try {
    await poolCrm.query("SELECT 1 as connected")
    console.log(`CRM Database connected successfully to: ${configCrm.host}:${configCrm.port}/${configCrm.database}`)
  } catch (error) {
    console.error('CRM Database connection failed:', error.message)
  }
}

testConnection()

module.exports = poolCrm
