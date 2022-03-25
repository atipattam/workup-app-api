const express = require('express')
const router = express.Router()

const { authenticateUser } = require('../middleware/authentication')
const { authorizeRoles } = require('../middleware/full-auth')
const {
  createApplication,
  getAllApplication,
  getApplicationById,
  getAllCurrentApplication,
  deleteApplication,
  updateStatusApplicationId,
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
  .delete([authenticateUser, authorizeRoles('candidate')], deleteApplication)
router
  .route('/company')
  .get([authenticateUser, authorizeRoles('company')], getAllApplication)

router
  .route('/company/:id')
  .get([authenticateUser, authorizeRoles('company')], getApplicationById)
  .patch(
    [authenticateUser, authorizeRoles('company')],
    updateStatusApplicationId
  )
module.exports = router
