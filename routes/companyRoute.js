const express = require('express')
const router = express.Router()

const { authenticateUser } = require('../middleware/authentication')

const {
 getCompanyByid, getAllCompanyAndJob
} = require('../controllers/companyController')

router.route('/').get(getAllCompanyAndJob)
router
  .route('/:id')
  .get(getCompanyByid)

module.exports = router
