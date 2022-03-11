const express = require('express')
const router = express.Router()

const { uploadImage, uploadPDF } = require('../controllers/uploadController')

router.route('/uploads').post(uploadImage)
router.route('/uploads/pdf').post(uploadPDF)

module.exports = router
