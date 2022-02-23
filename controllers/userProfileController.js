const Profile = require('../models/UserProfile')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

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
  if(!email){
    throw new CustomError.BadRequestError('Please provide email')
  }
  const profileData = await Profile.findOne({ emailAuth: email })
  if (!profileData) {
    throw new CustomError.BadRequestError('Not found with this account')
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Get complete', data: profileData.imgProfile })
}

module.exports = { getUserProfile , getUserByEmail}
