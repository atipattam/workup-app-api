const express = require('express')
const router = express.Router()

const { authenticateUser } = require('../middleware/authentication')

const {getUserProfile, getUserByEmail , updateUserProfile} = require('../controllers/userProfileController')


router.get('/getUserProfile', authenticateUser, getUserProfile)
router.post('/getImgProfile', getUserByEmail)
router.patch('/profile',authenticateUser,updateUserProfile)

module.exports = router
