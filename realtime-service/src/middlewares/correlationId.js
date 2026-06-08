const { v4: uuidv4 } = require('uuid')

const correlationId = (req, res, next) => {
  req.traceId = uuidv4()
  next();
}

module.exports = {
    correlationId
}
