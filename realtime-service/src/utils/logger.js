const winston = require('winston')
const path = require('path')

const logDir = 'logs';

const formatWithTraceId = winston.format((info) => {
  if (info.traceId) {
    info.message = `[TRACE ${info.traceId}] ${info.message}`;
  }
  return info;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    formatWithTraceId(),
    winston.format.timestamp(),
    winston.format.printf(info => {
      return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'app.log') }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger
