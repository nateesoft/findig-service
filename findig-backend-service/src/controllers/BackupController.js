const BackupService = require('../services/BackupService')

const createBackup = async (req, res, next) => {
  try {
    const result = await BackupService.createPosBackup()
    res.json(result)
  } catch (err) {
    next(err)
  }
}

const listBackups = async (req, res, next) => {
  try {
    const result = await BackupService.listBackups()
    res.json(result)
  } catch (err) {
    next(err)
  }
}

module.exports = { createBackup, listBackups }
