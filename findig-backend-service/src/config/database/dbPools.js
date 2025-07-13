const mysql = require('mysql');
const mysql2 = require('mysql2/promise');
const util = require('util');

const branchConfig = require('./branch_config.js');

const pools = {};

for (const branch of branchConfig) {
  pools[branch.code] = {};

  for (const [dbKey, dbConf] of Object.entries(branch.databases)) {
    if (branch.driver === 'mysql') {
      const pool = mysql.createPool({
        connectionLimit: 10,
        ...dbConf
      });
      // promisify ให้เหมือน mysql2
      pool.query = util.promisify(pool.query);
      pools[branch.code][dbKey] = {
        driver: 'mysql',
        pool
      };
    } else if (branch.driver === 'mysql2') {
      const pool = mysql2.createPool({
        connectionLimit: 10,
        ...dbConf
      });
      pools[branch.code][dbKey] = {
        driver: 'mysql2',
        pool
      };
    }
  }
}

module.exports = pools;
