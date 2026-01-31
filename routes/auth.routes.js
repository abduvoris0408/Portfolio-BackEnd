const express = require('express')
const {
	register,
	login,
	logout,
	getMe,
	updateDetails,
	updatePassword,
} = require('../controllers/auth.controller')

const router = express.Router()

const { protect } = require('../middleware/auth.middleware')
const {
	registerValidation,
	loginValidation,
	validate,
} = require('../middleware/validator')

router.post('/register', registerValidation, validate, register)
router.post('/login', loginValidation, validate, login)
router.get('/logout', logout)
router.get('/me', protect, getMe)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword', protect, updatePassword)

module.exports = router
