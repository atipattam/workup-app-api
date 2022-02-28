const User = require('../models/User')
const Profile = require('../models/UserProfile')
const Token = require('../models/Token')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { attachCookiesToResponse } = require('../utils')
const {
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
  createJWT,
} = require('../utils')
const crypto = require('crypto')

const register = async (req, res) => {
  const { email, firstName, lastName, companyName, password, role } = req.body

  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists')
  }

  const verificationToken = crypto.randomBytes(40).toString('hex')
  let userData = {}
  if (!role) {
    throw new CustomError.BadRequestError('Please provide role')
  }
  if (role === 'candidate') {
    if (!firstName || !lastName) {
      throw new CustomError.BadRequestError('Please provide name and lastname')
    }
    userData.firstName = firstName
    userData.lastName = lastName
  } else if (role === 'company') {
    if (!companyName) {
      throw new CustomError.BadRequestError('Please provide companyName')
    }
    userData.companyName = companyName
  }

  const user = await User.create({
    ...userData,
    email,
    password,
    role,
    verificationToken,
  })
  const origin = 'http://localhost:3000'

  await sendVerificationEmail({
    name: user.companyName,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  })
  // send verification token back only while testing in postman!!!
  res.status(StatusCodes.CREATED).json({
    msg: 'Success Please check your email to verify account',
  })
}

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body
  const user = await User.findOne({ email })

  const { firstName, lastName, role } = user
  if (!user) {
    throw new CustomError.UnauthenticatedError('Verification Failed')
  }

  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError('Verification Failed')
  }

  ;(user.isVerified = true), (user.verified = Date.now())
  user.verificationToken = ''

  await user.save()
  if (role === 'candidate') {
    await Profile.create({
      firstName,
      lastName,
      email,
      userId: user._id,
      education: [{}],
      birthDate: null,
      pastWork: [],
      education: [{}],
      isUpdate: false,
      address: '',
      imgProfile: '',
      pastWorkImg: [],
      interestedJob: [],
      gender: '',
      marital: '',
      emailAuth: email,
    })
  }
  res.status(StatusCodes.OK).json({ msg: 'Email Verified' })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }
  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError('Please verify your email')
  }
  const tokenUser = createTokenUser(user)
  // create refresh token
  let refreshToken = ''
  // check for existing token
  const existingToken = await Token.findOne({ user: user._id })

  if (existingToken) {
    const { isValid } = existingToken
    if (!isValid) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    refreshToken = existingToken.refreshToken
    const myToken = { ...tokenUser, refreshToken }
    const generateToken = createJWT({ payload: myToken })
    const data = { ...tokenUser, userToken: generateToken }

    res.status(StatusCodes.OK).json({ user: data })
    return
  }

  refreshToken = crypto.randomBytes(40).toString('hex')
  const generateToken = createJWT({ payload: { ...tokenUser, refreshToken } })
  const userAgent = req.headers['user-agent']
  const ip = req.ip
  const userToken = { refreshToken, ip, userAgent, user: user._id }

  await Token.create(userToken)

  res
    .status(StatusCodes.OK)
    .json({ user: { ...tokenUser, userToken: generateToken } })
}

const checkLogin = async (req, res) => {
  const { userId, refreshToken, userType } = req.user
  res.status(StatusCodes.OK).json({
    data: { userToken: refreshToken, userId: userId, userType },
    msg: 'login Success',
  })
}

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId })

  res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}

const forgotPassword = async (req, res) => {
  const { email } = req.body
  if (!email) {
    throw new CustomError.BadRequestError('Please provide valid email')
  }

  const user = await User.findOne({ email })

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString('hex')
    // send email
    const origin = 'http://localhost:3000'
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    })

    const tenMinutes = 1000 * 60 * 10
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)

    user.passwordToken = createHash(passwordToken)
    user.passwordTokenExpirationDate = passwordTokenExpirationDate
    await user.save()
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: 'Please check your email for reset password link' })
}

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body
  if (!token || !email || !password) {
    throw new CustomError.BadRequestError('Please provide all values')
  }
  const user = await User.findOne({ email })

  if (user) {
    const currentDate = new Date()

    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password
      user.passwordToken = null
      user.passwordTokenExpirationDate = null
      await user.save()
    }
  }

  res.send('reset password')
}

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkLogin,
}
