const Profile = require('../models/UserProfile')
const CompanyProfile = require('../models/CompanyProfile')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { checkTypeBody } = require('../utils/checkTypeBody')
const User = require('../models/User')

const getUserProfile = async (req, res) => {
  const { userId } = req.user
  const profileData = await Profile.findOne({ userId })
  if (!profileData) {
    throw new CustomError.BadRequestError('Not found with this account')
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Get data complete', data: profileData })
}

const getUserByEmail = async (req, res) => {
  const { email } = req.body
  const user = User.findOne({ email })
  if (!email) {
    throw new CustomError.BadRequestError('Please provide email')
  }
  const role = user.role
  let data = ''
  if (role === 'candidate') {
    const profileData = await Profile.findOne({ emailAuth: email })
    if (!profileData) {
      throw new CustomError.BadRequestError('Not found with this account')
    }
    data = {imgProfile: profileData.imgProfile, name: profileData.firstName}
  }

  if (role === 'company') {
    const profileData = await CompanyProfile.findOne({ emailAuth: email })
    if (!profileData) {
      throw new CustomError.BadRequestError('Not found with this account')
    }
    data = { imgProfile: profileData.imgProfile, name: profileData.companyName }
  }
  if (!data) {
    throw new CustomError.BadRequestError('Not found with this account')
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Get complete', data: profileData.imgProfile })
}
const updateUserProfile = async (req, res) => {
  const { userId } = req.user
  const allData = req.body

  const schema = {
    firstName: 'string',
    lastName: 'string',
    email: 'string',
    birthDate: 'date',
    address: 'string',
    interestedJob: 'array',
    education: 'array',
    pastWork: 'array',
    pastWorkImg: 'array',
    imgProfile: 'string',
    gender: 'string',
    marital: 'string',
  }
  const check = checkTypeBody(allData, schema)
  if (!check) {
    throw new CustomError.BadRequestError('something wrong')
  }
  await Profile.findOneAndUpdate({ userId }, { ...allData, isUpdate: true })

  res.status(StatusCodes.OK).json({ msg: 'Update Success' })
}

module.exports = { getUserProfile, getUserByEmail, updateUserProfile }
