const Company = require('../models/CompanyProfile')
const CustomError = require('../errors')
const { checkTypeBody } = require('../utils/checkTypeBody')
const { StatusCodes } = require('http-status-codes')

const getCompanyProfile = async (req, res) => {
  const { userId } = req.user
  const profile = await Company.findOne({ userId })
  if (!profile) {
    throw new CustomError.BadRequestError('Not found with this account')
  }
  res.status(StatusCodes.OK).json({ msg: 'Get data complete', data: profile })
}

const updateCompanyProfile = async (req, res) => {
  const { userId } = req.user
  const allData = req.body
  if (!allData) {
    throw new CustomError.BadRequestError('Please send your data')
  }

  const schema = {
    companyName: 'string',
    email: 'string',
    detail: 'string',
    welfare: 'array',
    phoneNumber: 'string',
    travel: 'array',
    address: 'string',
    imgProfile: 'string',
    imgAbout: 'array',
    imgCover: 'string',
  }
  const check = checkTypeBody(allData, schema)
  if (!check) {
    throw new CustomError.BadRequestError('something wrong')
  }
  await Company.findOneAndUpdate({ userId }, { ...allData, isUpdate: true })
  res.status(StatusCodes.OK).json({ msg: 'Update Success' })
}

module.exports = { getCompanyProfile, updateCompanyProfile }
