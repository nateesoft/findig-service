const NodeCache = require('node-cache')

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
// stdTTL = default ttl, checkperiod = ตรวจ expired key

module.exports = cache
