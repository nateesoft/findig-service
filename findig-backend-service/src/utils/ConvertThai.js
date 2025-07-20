const { ASCII2Unicode } = require("./StringUtil")

const mappingResultData = (result) => {
  const fields = Array.from(new Set(result.flatMap((obj) => Object.keys(obj))))
  const mappingResult = result.map((item) => {
    const newItem = { ...item }
    fields.forEach((key) => {
      if (typeof newItem[key] === "string") {
        newItem[key] = ASCII2Unicode(newItem[key])
      }
    })
    return newItem
  })
  return mappingResult ?? [0]
}

const mappingResultDataList = (resultList) => {
  const fields = Array.from(
    new Set(resultList.flatMap((obj) => Object.keys(obj)))
  )
  const mappingResult = resultList.map((item) => {
    const newItem = { ...item }
    fields.forEach((key) => {
      if (typeof newItem[key] === "string") {
        newItem[key] = ASCII2Unicode(newItem[key])
      }
    })
    return newItem
  })
  return mappingResult
}

module.exports = {
  mappingResultData,
  mappingResultDataList
}
