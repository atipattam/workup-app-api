const CompanyProfile = require('../models/CompanyProfile')
const Announce = require('../models/Announcement')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const getCompanyByid = async (req, res) => {
  const { id } = req.params
  const companyProfile = await CompanyProfile.findOne({ _id: id })
  const announce = await Announce.find({ companyId: id })
  const myData = {
    companyName: companyProfile.companyName,
    email: companyProfile.email,
    detail: companyProfile.detail,
    welfare: companyProfile.welfare,
    phone: companyProfile.phoneNumber,
    imgProfile: companyProfile.imgProfile,
    address: companyProfile.address,
    imgCover: companyProfile.imgCover,
    travel: companyProfile.travel,
    imgAbout: companyProfile.imgAbout,
    announce: announce,
  }
  res.status(StatusCodes.OK).json({
    msg: 'get complete',
    data: myData,
  })
}

const getAllCompanyAndJob = async (req, res) => {
  const companyProfile = await CompanyProfile.find({}).limit(10)
  const announce = await Announce.find({}).sort({ updatedAt: -1 }).limit(6)

  const myArr = []
  const annArr = []
  for (let data of companyProfile) {
    const myData = {
      companyName: data.companyName,
      announceText: data.announceText,
      imgCover: data.imgCover,
      imgProfile: data.imgProfile,
      companyId: data._id,
    }
    myArr.push(myData)
  }
  for (let data of announce) {
    const company = await CompanyProfile.findOne({ companyId: data.companyId })
    const myData = {
      companyName: company.companyName,
      imgProfile: company.imgProfile,
      salary: data.salary,
      updatedAt: data.updateAt,
      id: data._id,
      position: data.position,
    }
    annArr.push(myData)
  }
  res.status(StatusCodes.OK).json({
    msg: 'get complete',
    data: myArr,
    announce: annArr,
  })
}
module.exports = { getCompanyByid, getAllCompanyAndJob }
