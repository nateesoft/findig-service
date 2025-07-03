const express = require('express');
const router = express.Router();

const PosUserService= require("../../services/PosUserService");

router.get('/', (req, res) => {
  PosUserService.getAllData()
    .then(rows => {
      res.status(200).json({ status: 2000, data: rows })
    })
    .catch(err => {
      res.status(500).json({ status: 5000, data: null, errorMessage: err.message })
    })
});

router.post('/login', function (req, res) {
  const { username, password } = req.body

  PosUserService.checkLogin(username, password, req.db)
    .then(rows => {
      res.status(200).json({ status: 2000, data: rows })
    })
    .catch(err => {
      res.status(500).json({ status: 5000, data: null, errorMessage: err.message })
    })
});

router.post('/loginAuth', function (req, res) {
  const { username, password } = req.body

  PosUserService.getLoginAuthen(username, password)
    .then(rows => {
      if (rows) {
        res.status(200).json({ status: 2000, data: rows })
      } else {
        res.status(200).json({ status: 4000, rows: rows })
      }
    })
    .catch(err => {
      res.status(500).json({ status: 5000, data: null, errorMessage: err.message })
    })
});

router.patch('/logout', function (req, res) {
  const { username } = req.body

  PosUserService.processLogout(username)
    .then(rows => {
      res.status(200).json({ status: 2000, data: rows })
    })
    .catch(err => {
      res.status(500).json({ status: 5000, data: null, errorMessage: err.message })
    })
});

router.get('/:username', (req, res) => {
  const { username } = req.params
  PosUserService.getDataByUserName(username)
    .then(rows => {
      res.status(200).json({ status: 2000, data: rows })
    })
    .catch(err => {
      res.status(500).json({ status: 5000, data: null, errorMessage: err.message })
    })
});

module.exports = router;
