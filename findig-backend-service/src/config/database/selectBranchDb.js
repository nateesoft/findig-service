const pools = require('./dbPools.js');

const selectBranchDb = (req, res, next) => {
  const dbConfig = process.env.dbConfig;//req.body.dbConfig || req.query.dbConfig || req.headers['x-branch-code'];

  if (!dbConfig) {
    return res.status(400).json({ error: 'Database Config is required' });
  }

  const branchPools = pools[dbConfig];
  if (!branchPools) {
    return res.status(404).json({ error: 'Branch not found' });
  }

  req.db = {};

  for (const [dbKey, dbInfo] of Object.entries(branchPools)) {
    if (dbInfo.driver === 'mysql') {
      req.db[dbKey] = {
        async query(sql, params) {
          return dbInfo.pool.query(sql, params);
        }
      };
    } else if (dbInfo.driver === 'mysql2') {
      req.db[dbKey] = {
        async query(sql, params) {
          const [rows] = await dbInfo.pool.execute(sql, params);
          return rows;
        }
      };
    }
  }

  next();
}

module.exports = selectBranchDb
