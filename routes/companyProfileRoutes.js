const express = require('express')
const router = express.Router()

const { authenticateUser } = require('../middleware/authentication')

const {
  updateCompanyProfile,
  getCompanyProfile,
} = require('../controllers/companyProfileController')

router
  .route('/profile')
  .get(authenticateUser, getCompanyProfile)
  .patch(authenticateUser, updateCompanyProfile)

module.exports = router
