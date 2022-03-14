const CustomError = require('../errors')
const Application = require('../models/Application')
const Announcement = require('../models/Announcement')
const UserProfile = require('../models/UserProfile')
const CompanyProfile = require('../models/CompanyProfile.js')
const _isEmpty = require('lodash/isEmpty')
const { StatusCodes } = require('http-status-codes')

const createApplication = async (req, res) => {
  const allData = req.body
  const { userId } = req.user
  const announceId = req.params.id
  if (!allData) {
    throw new CustomError.BadRequestError('Please send upload Data')
  }
  if (!announceId) {
    throw new CustomError.BadRequestError('missing Announce ID')
  }
  const announce = await Announcement.findOne({ _id: announceId })
  const userProfile = await UserProfile.findOne({ userId })
  if (!announce) {
    throw new CustomError.BadRequestError('Not found with announceId')
  }
  const application = await Application.findOne({
    announceId,
    userId: userProfile._id,
  })
  if (application) {
    throw new CustomError.BadRequestError('Already created job with this account')
  }
  await Application.create({
    userId: userProfile._id,
    companyId: announce.companyId,
    announceId: announce._id,
    other: allData,
  })
  res.status(StatusCodes.OK).json({ msg: 'Application done' })
}

const getAllApplication = async (req, res) => {
  const { userId } = req.user
  const myArr = []
  const profile = await CompanyProfile.findOne({ userId })
  if (!profile) {
    throw new CustomError.BadRequestError('Not found')
  }
  const application = await Application.find({ companyId: profile._id })
  if (_isEmpty(application)) {
    throw new CustomError.BadRequestError('Empty Application')
  }
  for (let data in application) {
    const candidate = await UserProfile.findOne({
      _id: application[data].userId,
    })
    const announce = await Announcement.findOne({
      _id: application[data].announceId,
    })
    const myData = {
      applicationId: application[data]._id,
      imgProfile: candidate.imgProfile,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      position: announce.position,
    }
    myArr.push(myData)
  }
  res.status(StatusCodes.OK).json({ data: myArr })
}

const getApplicationById = async (req, res) => {
  const applicationId = req.params.id
  const application = await Application.findOne({ _id: applicationId })
  const userProfile = await UserProfile.findOne({ _id: application.userId })
  const data = {
    applicationId: application._id,
    createdAt: application.createdAt,
    updateAt: application.updatedAt,
    userProfile,
    other: application.other,
  }
  res.status(StatusCodes.OK).json({ data })
}

const getAllCurrentApplication = async (req, res) => {
  const { userId } = req.user
  const userProfile = await UserProfile.findOne({ userId })
  const application = await Application.find({ userId: userProfile._id })
  res.status(StatusCodes.OK).json({ application })
}
module.exports = {
  createApplication,
  getAllApplication,
  getApplicationById,
  getAllCurrentApplication,
}
