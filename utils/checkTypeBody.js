const _isDate = require('lodash/isDate')
const _isArray = require('lodash/isArray')
const _isEmpty = require('lodash/isEmpty')
const _join = require('lodash/join')
const CustomError = require('../errors')
const checkTypeBody = (data, type) => {
  const arr = Object.keys(data)
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
    console.log(messageArr, '23')
    throw new CustomError.BadRequestError(message)
  }
  return true
}
module.exports = { checkTypeBody }
