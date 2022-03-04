const { checkTypeBody, requireData } = require('../utils/checkTypeBody')
const Announce = require('../models/Announcement')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')

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
  res.status(StatusCodes.OK).json({
    msg: 'get all complete',
    data: myAnnounce,
  })
}


module.exports = { createAnnouncement, getAllAnnouncementCompany }
