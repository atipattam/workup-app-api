const express = require('express')
const router = express.Router()

const { authenticateUser } = require('../middleware/authentication')

const {getUserProfile, getUserByEmail} = require('../controllers/userProfileController')


router.get('/getUserProfile', authenticateUser, getUserProfile)
router.post('/getImgProfile', getUserByEmail)

module.exports = router
