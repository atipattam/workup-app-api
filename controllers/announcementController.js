const { checkTypeBody, requireData } = require('../utils/checkTypeBody')
const Application = require('../models/Application')
const Announce = require('../models/Announcement')
const CompanyProfile = require('../models/CompanyProfile')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const _isEmpty = require('lodash/isEmpty')
const schema = {
  jobType: 'string',
  position: 'string',
  positionTotal: 'number',
  salary: 'string',
  role: 'array',
  location: 'string',
  property: 'array',
  interview: 'string',
  isActive: 'boolean',
}

const createAnnouncement = async (req, res) => {
  const { userId } = req.user
  const allData = req.body
  const companyProfile = await CompanyProfile.findOne({ userId })

  await requireData(allData, schema)
  const check = checkTypeBody(allData, schema)
  if (!check) {
    throw new CustomError.BadRequestError('Something Wrong')
  }
  await Announce.create({
    companyId: companyProfile._id,
    ...allData,
    isActive: true,
  })
  res.status(StatusCodes.CREATED).json({
    msg: 'Create Announcement Success',
  })
}

const getAllAnnouncementCompany = async (req, res) => {
  const { userId } = req.user
  const companyProfile = await CompanyProfile.findOne({ userId })
  const myAnnounce = await Announce.find({ companyId: companyProfile._id })

  if (_isEmpty(myAnnounce)) {
    throw new CustomError.BadRequestError('This Company dont have announcement')
  }
  res.status(StatusCodes.OK).json({
    msg: 'get all complete',
    data: myAnnounce,
  })
}

const getAnnounceById = async (req, res) => {
  const announceId = req.params.id

  const announce = await Announce.findOne({ _id: announceId })
  const companyProfile = await CompanyProfile.findOne({
    _id: announce.companyId,
  })
  const otherAnnounce = await Announce.find({
    _id: { $ne: announceId },
    companyId: announce.companyId,
  })
    .sort({ updatedAt: -1 })
    .limit(4)
  if (!announce) {
    throw new CustomError.BadRequestError('Not found with announce id')
  }
  res.status(StatusCodes.OK).json({
    msg: 'get announce complete',
    data: {
      announce,
      otherAnnounce,
      companyName: companyProfile.companyName,
      imgProfile: companyProfile.imgProfile,
    },
  })
}
const updateAnnouncement = async (req, res) => {
  const { userId } = req.user
  const allData = req.body
  const announceId = req.params.id
  const companyProfile = await CompanyProfile.findOne({ userId })
  const announce = await Announce.findOne({
    _id: announceId,
    companyId: companyProfile._id,
  })
  if (_isEmpty(allData)) {
    throw new CustomError.BadRequestError('Please send data')
  }
  // console.log(companyProfile._id, announce.companyId, 'hello')
  if (_isEmpty(announce)) {
    throw new CustomError.BadRequestError(
      'This announce can update with own company'
    )
  }
  checkTypeBody(allData, schema)
  await Announce.updateOne({ _id: announceId }, allData)
  await Application.updateMany(
    { companyId: companyProfile._id, announceId: announce._id },
    { isActive: false, isUpdate: true, isDelete: false }
  )
  res.status(StatusCodes.OK).json({
    msg: 'update success',
  })
}
const deleteAnnouncement = async (req, res) => {
  const { userId } = req.user
  const announceId = req.params.id
  const company = await CompanyProfile.findOne({ userId })
  const announce = await Announce.findOne({
    companyId: company._id,
    _id: announceId,
  })
  if (!announce) {
    throw new CustomError.BadRequestError('Announce can not delete')
  }
  await Announce.deleteOne({ _id: announceId })
  await Application.updateMany(
    { companyId: company._id, announceId: announce._id },
    { isActive: false, isUpdate: false, isDelete: true }
  )
  res.status(StatusCodes.OK).json({
    msg: 'delete success',
  })
}
module.exports = {
  createAnnouncement,
  getAllAnnouncementCompany,
  getAnnounceById,
  updateAnnouncement,
  deleteAnnouncement,
}
