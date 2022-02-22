const CustomError = require('../errors')
const { isTokenValid, createJWT } = require('../utils')
const Token = require('../models/Token')

const authenticateUser = async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new CustomError.UnauthenticatedError('Missing Token')
  }
  const refreshToken = req.headers.authorization
  try {
    const payload = isTokenValid(refreshToken)
    const existingToken = await Token.findOne({
      user: payload.userId,
      refreshToken: payload.refreshToken,
    })
    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }
    const userData = createJWT({ payload })
    const data = { userId: payload.userId, refreshToken: userData }
    req.user = data
    next()
  } catch (error) {
    console.log(error)
    throw new CustomError.UnauthenticatedError('Not found with authentication')
  }
}

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      )
    }
    next()
  }
}

module.exports = {
  authenticateUser,
  authorizePermissions,
}
