
const pool = require('../config/database/dbPools')
const { mappingResultData } = require('../utils/ConvertThai')

const getData = async () => {
    const sql = `select * from posuser limit 1`;
    const results = await pool.query(sql)

    return mappingResultData(results)
}

const getDataByRefno = async (refNo) => {
    const sql = `select * from posuser limit 1`;
    const results = await pool.query(sql)

    return mappingResultData(results)
}

const saveData = async (payload) => {
    const sql = `select * from posuser where username='${username}'`
    const results = await pool.query(sql)
    if (results.length > 0) {
        const newResult = mappingResultData(results)
        return {...newResult, Password: ""}
    }
    return null
}

module.exports = {
    getData,
    getDataByRefno,
    saveData
}
