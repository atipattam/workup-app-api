const express = require('express')
const router = express.Router()

const { uploadImage } = require('../controllers/uploadController')

router.route('/uploads').post(uploadImage)

module.exports = router
