const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const {
	loginSchema,
	updatePasswordSchema,
	updateDetailsSchema,
} = require('../validators/auth.validator')
const { uploadAvatar: uploadAvatarMiddleware } = require('../config/cloudinary.config')

const {
	login,
	logout,
	getMe,
	updateDetails,
	updatePassword,
	refreshToken,
	uploadAvatar,
	deleteAvatar,
} = require('../controllers/auth.controller')

// Public
router.post('/login', validate(loginSchema), login)
router.post('/refresh-token', refreshToken)

// Private
router.post('/logout', protect, logout)
router.get('/me', protect, getMe)
router.put('/update-details', protect, validate(updateDetailsSchema), updateDetails)
router.put('/update-password', protect, validate(updatePasswordSchema), updatePassword)

// Avatar
router.put('/avatar', protect, uploadAvatarMiddleware.single('avatar'), uploadAvatar)
router.delete('/avatar', protect, deleteAvatar)

module.exports = router
