const moment = require('moment')

const getMoment = (dateStr) => {
    if (!dateStr) {
        return moment().utc(true)
    } else {
        return moment(dateStr).utc(true)
    }
}

const getMomentTime = (dateStr) => {
    if (!dateStr) {
        return moment().utc(true)
    } else {
        return moment(dateStr).utc(true)
    }
}

const getCurrentTime = () => {
    return moment().utc(true).format('HH:mm:ss')
}

const getYesterday = () => {
    return moment().add(-1, 'day').utc(true)
}

// Convert DD/MM/YYYY to YYYY-MM-DD for MySQL
const convertToMySQLDate = (dateStr) => {
    if (!dateStr) return '';
    const m = moment(dateStr, 'DD/MM/YYYY', true);
    return m.isValid() ? m.format('YYYY-MM-DD') : '';
}

module.exports = {
    getMoment,
    getMomentTime,
    getYesterday,
    getCurrentTime,
    convertToMySQLDate
}