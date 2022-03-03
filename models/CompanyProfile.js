const mongoose = require('mongoose')
const validator = require('validator')

const CompanyProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  emailAuth: { type: String },

  companyName: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  isUpdate: {
    type: Boolean,
  },
  detail: {
    type: String,
  },
  welfare: {
    type: [],
  },
  phoneNumber: {
    type: String,
  },
  travel: {
    type: [],
  },
  address: {
    type: String,
  },
  imgProfile: {
    type: String,
  },
  imgAbout:{
    type: [],
  }
})

module.exports = mongoose.model('CompanyProfile', CompanyProfileSchema)
