const mongoose = require('mongoose')

const ApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'UserProfile',
      required: true,
    },
    announceId: {
      type: mongoose.Types.ObjectId,
      ref: 'Announcement',
      required: true,
    },
    companyId: {
      type: mongoose.Types.ObjectId,
      ref: 'CompanyProfile',
      required: true,
    },
    other: { type: [] },
    isActive: {
      type:Boolean
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Application', ApplicationSchema)
