const express = require('express')
const router = express.Router()

const { authenticateUser } = require('../middleware/authentication')
const { authorizeRoles } = require('../middleware/full-auth')
const {
  createApplication,
  getAllApplication,
  getApplicationById,
  getAllCurrentApplication,
} = require('../controllers/applicationController')

router
  .route('/candidate')
  .get(
    [authenticateUser, authorizeRoles('candidate')],
    getAllCurrentApplication
  )
router
  .route('/candidate/:id')
  .post([authenticateUser, authorizeRoles('candidate')], createApplication)
router
  .route('/company')
  .get([authenticateUser, authorizeRoles('company')], getAllApplication)

router
  .route('/company/:id')
  .get([authenticateUser, authorizeRoles('company')], getApplicationById)
module.exports = router
