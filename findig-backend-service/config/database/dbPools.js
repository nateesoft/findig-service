const mysql = require('mysql');
const util = require('util');

const branchConfig = require('./branch_config.js');

const pools = {};

for (const branch of branchConfig) {
  pools[branch.code] = {};

  for (const [dbKey, dbConf] of Object.entries(branch.databases)) {
    const pool = mysql.createPool({
        host: dbConf.host,
        user: dbConf.user,
        password: dbConf.password,
        database: dbConf.database,
        port: dbConf.port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 10000,
        maxIdle: 3,
        idleTimeout: 60000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    });

    // wrap query
    pool.query = util.promisify(pool.query);
    pools[branch.code][dbKey] = pool;
  }
}

module.exports = pools;
