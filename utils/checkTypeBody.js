const _isDate = require('lodash/isDate')
const _isArray = require('lodash/isArray')
const _isEmpty = require('lodash/isEmpty')
const _join = require('lodash/join')
const _xor = require('lodash/xor')
const _filter = require('lodash/filter')
const CustomError = require('../errors')
const checkTypeBody = (data, type) => {
  const arr = Object.keys(data)
  const typeArr = Object.keys(type)
  const diff = _filter(arr, (data) => !typeArr.includes(data))
  if (!_isEmpty(diff)) {
    const message = _join(diff, 'is false format , ')
    throw new CustomError.BadRequestError(message)
  }
  const messageArr = []
  arr.forEach((field, i) => {
    if (
      typeof data[field] !== type[field] &&
      type[field] !== 'array' &&
      type[field] !== 'date'
    ) {
      messageArr.push(`Please provide ${field} to ${type[field]} type`)
    } else if (type[field] === 'array' && !_isArray(data[field])) {
      messageArr.push(`Please provide ${field} to array type`)
    } else if (type[field] === 'date' && !_isDate(new Date(data[field]))) {
      messageArr.push(`Please provide ${field} to date type`)
    }
  })

  if (!_isEmpty(messageArr)) {
    const message = _join(messageArr, ', ')
    throw new CustomError.BadRequestError(message)
  }
  return true
}

const requireData = (data, schema) => {
  const arr = Object.keys(schema)
  const dataArr = Object.keys(data)

  const messageArr = _xor(arr, dataArr)
  if (!_isEmpty(messageArr)) {
    const message = _join(messageArr, ', ')
    throw new CustomError.BadRequestError(`Please provide field ${message}`)
  }
}
module.exports = { checkTypeBody, requireData }
