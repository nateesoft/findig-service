const PosUserService = require('../services/PosUserService')
const PosUserRepository = require("../repository/PosUserRepository")

const validateLogin = async (req, res, next) => {
  const { username, password } = req.body
  try {
    const result = await PosUserService.checkLogin({
      payload: { username, password },
      repository: PosUserRepository,
      db: req.db
    })
    if(result) {
      res.json(result);
    } else {
      res.status(401).json({ error: 'Invalid username or password' }); // Return 401 Unauthorized if login fails
    }
  } catch (err) {
    next(err);
  }
};

const processLogout = async (req, res, next) => {
  try {
    const { username } = req.body
    const result = await PosUserService.processLogout({
      payload: { username},
      repository: PosUserRepository,
      db: req.db
    })
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const getAllUser = async (req, res, next) => {
  try {
    const result = await PosUserService.getAllUser({
      payload: {},
      repository: PosUserRepository,
      db: req.db
    })
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  validateLogin,
  processLogout,
  getAllUser
}