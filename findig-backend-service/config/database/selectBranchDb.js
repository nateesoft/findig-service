const pools = require('./dbPools.js');

const selectBranchDb = (req, res, next) => {
  const branchCode = req.body.branchCode || req.query.branchCode || req.headers['x-branch-id'];

  if (!branchCode) {
    return res.status(400).json({ error: 'Branch ID is required' });
  }

  const branchPools = pools[branchCode];
  if (!branchPools) {
    return res.status(404).json({ error: 'Branch not found' });
  }

  // set req.db แบบ object เพื่อให้เลือกได้ว่า main, report หรือ audit
  req.db = branchPools;

  next();
}

module.exports = selectBranchDb
