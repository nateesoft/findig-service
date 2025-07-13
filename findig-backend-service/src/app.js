const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const logger = require('morgan');
// const basicAuth = require('express-basic-auth')
const compression = require("compression");
const helmet = require("helmet");
const cors = require('cors')

const { errorHandler } = require('./middlewares/errorHandler')
const requestLogger = require('./middlewares/requestLogger');
const { correlationId } = require('./middlewares/correlationId');
const selectBranchDb = require('./config/database/selectBranchDb');

const allRouter = require('./routes')

const app = express()
app.use(cors())
app.use(compression())
app.use(helmet());

const username = process.env.WEB_USER_AUTH
const password = process.env.WEB_USER_PASS
// app.use(basicAuth({ users: { [username]: password } }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// handle error mysql disconnect
app.use((req, res, next) => {
  res.setHeader('Connection', 'keep-alive')
  next()
})

app.use(correlationId)
app.use(requestLogger);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/version', (req, res) => {
  res.json({
    version: "0.0.0"
  })
})

// ใช้ middleware ก่อน protected routes
app.use('/api', selectBranchDb);
app.use(allRouter);

app.use(errorHandler)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on('uncaughtException', err => {
  console.error(err.stack)
})

module.exports = app;
