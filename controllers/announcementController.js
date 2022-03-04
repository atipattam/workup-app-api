const { checkTypeBody, requireData } = require('../utils/checkTypeBody')
const Announce = require('../models/Announcement')
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
}

const createAnnouncement = async (req, res) => {
  const { userId } = req.user
  const allData = req.body
  await requireData(allData, schema)
  const check = checkTypeBody(allData, schema)
  if (!check) {
    throw new CustomError.BadRequestError('Something Wrong')
  }
  await Announce.create({ companyId: userId, ...allData })
  res.status(StatusCodes.CREATED).json({
    msg: 'Create Announcement Success',
  })
}

const getAllAnnouncementCompany = async (req, res) => {
  const { userId } = req.user
  const myAnnounce = await Announce.find({ companyId: userId })

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
  if (!announce) {
    throw new CustomError.BadRequestError('Not found with announce id')
  }
  res.status(StatusCodes.OK).json({
    msg: 'get announce complete',
    data: announce,
  })
}
module.exports = {
  createAnnouncement,
  getAllAnnouncementCompany,
  getAnnounceById,
}
