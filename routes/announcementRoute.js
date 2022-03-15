const express = require('express')
const router = express.Router()

const { authenticateUser } = require('../middleware/authentication')
const { authorizeRoles } = require('../middleware/full-auth')
const {
  createAnnouncement,
  getAllAnnouncementCompany,
  getAnnounceById,
  updateAnnouncement,
} = require('../controllers/announcementController')

router
  .route('/')
  .post([authenticateUser, authorizeRoles('company')], createAnnouncement)

router.get(
  '/companyAnnounce',
  [authenticateUser, authorizeRoles('company')],
  getAllAnnouncementCompany
)
router.get('/:id', getAnnounceById)

router.route('/company/:id').patch([authenticateUser, authorizeRoles('company')],updateAnnouncement)

module.exports = router
