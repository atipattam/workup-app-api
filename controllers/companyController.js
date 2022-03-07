const CompanyProfile = require('../models/CompanyProfile')
const Announce = require('../models/Announcement')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const getCompanyByid = async(req,res) =>{
  const {id} = req.params
  const companyProfile = await CompanyProfile.findOne({_id: id})
  const announce = await Announce.find({companyId :id})
  const myData = {
    companyName : companyProfile.companyName,
    email: companyProfile.email,
    detail: companyProfile.detail,
    welfare: companyProfile.welfare,
    phone: companyProfile.phoneNumber,
    imgProfile: companyProfile.imgProfile,
    address: companyProfile.address,
    imgCover:companyProfile.imgCover,
    travel:companyProfile.travel,
    announce:announce
  }
    res.status(StatusCodes.OK).json({
      msg: 'get complete',
      data: myData,
    })
}
module.exports = {getCompanyByid}