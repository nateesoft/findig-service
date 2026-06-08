const morgan = require('morgan');
const logger = require('../utils/logger.js')

const stream = {
  write: (message) => logger.info(message.trim())
}

const requestLogger = morgan(function (tokens, req, res) {
  return `[TRACE ${req.traceId}] ${tokens.method(req, res)} ${tokens.url(req, res)} ${tokens.status(req, res)} - ${tokens['response-time'](req, res)} ms`;
}, { stream });

module.exports = requestLogger
