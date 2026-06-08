const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const moment = require('moment')
const branchConfig = require('../config/database/branch_config.js')

const BACKUP_DIR = path.join(__dirname, '../../backups')

const getMysqldumpPath = () => {
  // ใช้ MYSQLDUMP_PATH จาก env ก่อน ถ้าไม่มีใช้ mysqldump ตรงๆ (ต้องอยู่ใน PATH)
  const customPath = process.env.MYSQLDUMP_PATH
  if (customPath) {
    return `"${customPath}\\mysqldump.exe"`
  }
  return 'mysqldump'
}

const ensureBackupDir = () => {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
  }
}

const createPosBackup = () => {
  return new Promise((resolve, reject) => {
    ensureBackupDir()

    const dbConfig = process.env.dbConfig
    const branch = branchConfig.find(b => b.code === dbConfig)

    if (!branch) {
      return reject(new Error(`Branch config not found for: ${dbConfig}`))
    }

    const posDb = branch.databases.pos
    const timestamp = moment().format('YYYYMMDD_HHmmss')
    const filename = `backup_pos_${dbConfig}_${timestamp}.sql`
    const filepath = path.join(BACKUP_DIR, filename)

    const mysqldump = getMysqldumpPath()
    const cmd = `${mysqldump} -h ${posDb.host} -P ${posDb.port} -u ${posDb.user} -p${posDb.password} ${posDb.database} > "${filepath}"`

    exec(cmd, (err) => {
      if (err) return reject(err)
      const stats = fs.statSync(filepath)
      resolve({
        success: true,
        filename,
        filepath,
        size: stats.size,
        createdAt: moment().toISOString()
      })
    })
  })
}

const listBackups = () => {
  ensureBackupDir()

  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.endsWith('.sql'))
    .map(filename => {
      const filepath = path.join(BACKUP_DIR, filename)
      const stats = fs.statSync(filepath)
      return {
        filename,
        size: stats.size,
        createdAt: stats.birthtime
      }
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return Promise.resolve({ backups: files })
}

module.exports = { createPosBackup, listBackups }
