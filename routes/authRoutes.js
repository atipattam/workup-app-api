const express = require('express')
const router = express.Router()

const { authenticateUser } = require('../middleware/authentication')

const {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkLogin,
  updatePassword,
} = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.get('/checklogin', authenticateUser, checkLogin)
router.delete('/logout', authenticateUser, logout)
router.post('/verify-email', verifyEmail)
router.post('/reset-password', resetPassword)
router.post('/forgot-password', forgotPassword)
router.post('/update-password',authenticateUser,updatePassword)

module.exports = router
