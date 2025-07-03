const pools = require('./dbPools.js');

const selectBranchDb = (req, res, next) => {
  const branchCode = req.body.branchCode || req.query.branchCode || req.headers['x-branch-code'];

  if (!branchCode) {
    return res.status(400).json({ error: 'Branch Code is required' });
  }

  const branchPools = pools[branchCode];
  if (!branchPools) {
    return res.status(404).json({ error: 'Branch not found' });
  }

  // สร้าง unified API: req.db.main.query(...) ได้เลย
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
