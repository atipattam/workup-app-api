const express = require('express')
const router = express.Router()

const { authenticateUser } = require('../middleware/authentication')

const {
 getCompanyByid
} = require('../controllers/companyController')

router
  .route('/:id')
  .get(getCompanyByid)

module.exports = router
