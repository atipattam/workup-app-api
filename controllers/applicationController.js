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
    throw new CustomError.BadRequestError(
      'Already created job with this account'
    )
  }
  await Application.create({
    userId: userProfile._id,
    companyId: announce.companyId,
    announceId: announce._id,
    other: allData,
    isActive: true,
    isUpdate: false,
    isDelete: false,
    status: 'pending',
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
  const application = await Application.find({
    companyId: profile._id,
    isActive: true,
  })
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
      phone: candidate.phone,
      position: announce.position,
      createdAt: application[data].createdAt,
      updatedAt: application[data].updatedAt,
      status: application[data].status,
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
    status: application.status,
    createdAt: application.createdAt,
    updateAt: application.updatedAt,
    userProfile,
    other: application.other,
  }
  res.status(StatusCodes.OK).json({ data })
}

const updateStatusApplicationId = async (req, res) => {
  const { userId } = req.user
  const applicationId = req.params.id
  const { status } = req.body
  if (!status) {
    throw new CustomError.BadRequestError('Please send status')
  }

  const company = await CompanyProfile.findOne({ userId })
  const application = await Application.findOne({
    _id: applicationId,
    companyId: company._id,
  })

  if (!application) {
    throw new CustomError.BadRequestError('Cannnot Update status')
  }
  await Application.updateOne({ _id: applicationId }, { status })
  res.status(StatusCodes.OK).json({ msg: `Update status to ${status}` })
}

const getAllCurrentApplication = async (req, res) => {
  const { userId } = req.user
  const newArr = []
  const userProfile = await UserProfile.findOne({ userId })
  console.log(userProfile, 'userProfile')
  const application = await Application.find({
    userId: userProfile._id,
    isDelete: false,
  })
  for (let data in application) {
    const companyProfile = await CompanyProfile.findOne({
      _id: application[data].companyId,
    })
    const announce = await Announcement.findOne({
      _id: application[data].announceId,
    })
    console.log(application[data].announceId, 'an')
    const myData = {
      announceId: announce._id,
      applicationId: application[data]._id,
      companyName: companyProfile.companyName,
      companyImg: companyProfile.imgProfile,
      position: announce.position,
      updatedAt: application[data].updatedAt,
      createdAt: application[data].createdAt,
      status: application[data].status,
    }
    newArr.push(myData)
  }
  res.status(StatusCodes.OK).json({ data: newArr })
}

const deleteApplication = async (req, res) => {
  const { userId } = req.user
  const applicationId = req.params.id
  const user = await UserProfile.findOne({ userId })
  const application = await Application.findOne({
    userId: user._id,
    _id: applicationId,
  })
  if (!application) {
    throw new CustomError.BadRequestError('Cannnot delete this application')
  }
  await Application.deleteOne({ _id: applicationId })
  res.status(StatusCodes.OK).json({ msg: 'delete Success' })
}
module.exports = {
  createApplication,
  getAllApplication,
  getApplicationById,
  getAllCurrentApplication,
  deleteApplication,
  updateStatusApplicationId,
}
