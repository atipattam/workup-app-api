const mongoose = require('mongoose')
const validator = require('validator')

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  emailAuth: { type: String },
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  lastName: {
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
  birthDate: { type: Date },
  address: {
    type: String,
  },
  interestedJob: {
    type: [],
  },
  education: {
    type: [],
  },
  pastWork: {
    type: [],
  },
  imgProfile: {
    type: String,
  },
  pastWorkImg: {
    type: [],
  },
})

module.exports = mongoose.model('UserProfile', ProfileSchema)
