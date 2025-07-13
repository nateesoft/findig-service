const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error'
  });
}

module.exports = {
  errorHandler
}