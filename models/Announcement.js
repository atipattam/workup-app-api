const mongoose = require('mongoose')
const validator = require('validator')

const AnnouncementSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    jobType: { type: String },
    position: { type: String },
    positionTotal: { type: Number },
    salary: { type: String },
    role: { type: [] },
    location: { type: String },
    property: { type: [] },
    interview: { type: String },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Announcement', AnnouncementSchema)
