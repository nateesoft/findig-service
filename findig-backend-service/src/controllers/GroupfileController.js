const GroupfileService = require('../services/GroupfileService')
const GroupfileRepository = require("../repository/GroupfileRepository")

const getAllGroupfile = async (req, res, next) => {
  try {
    const result = await GroupfileService.getAllGroupFile({
      repository: GroupfileRepository,
      db: req.db
    })
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllGroupfile
}