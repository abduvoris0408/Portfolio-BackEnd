const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const { User } = require('../models')

// Helper – Token response
const sendTokenResponse = (user, statusCode, res) => {
	const accessToken = user.getSignedJwtToken()
	const refreshToken = user.getRefreshToken()

	const cookieOptions = {
		expires: new Date(
			Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000,
		),
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
	}

	res
		.status(statusCode)
		.cookie('token', accessToken, cookieOptions)
		.json({
			success: true,
			data: {
				accessToken,
				refreshToken,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
					avatar: user.avatar,
				},
			},
		})
}

// @desc    Login admin
// @route   POST /api/v1/auth/login
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body

	const user = await User.scope('withPassword').findOne({ where: { email } })

	if (!user) {
		return next(new ErrorResponse("Email yoki parol noto'g'ri", 401))
	}

	if (user.isLocked) {
		const lockTime = Math.ceil((user.lockUntil - Date.now()) / 60000)
		return next(
			new ErrorResponse(`Account bloklangan. ${lockTime} daqiqadan keyin urinib ko'ring`, 423),
		)
	}

	const isMatch = await user.matchPassword(password)

	if (!isMatch) {
		await user.incrementLoginAttempts()
		return next(new ErrorResponse("Email yoki parol noto'g'ri", 401))
	}

	await user.resetLoginAttempts()

	const refreshToken = user.getRefreshToken()
	user.refreshToken = refreshToken
	await user.save()

	sendTokenResponse(user, 200, res)
})

// @desc    Logout
// @route   POST /api/v1/auth/logout
exports.logout = asyncHandler(async (req, res, next) => {
	await User.update({ refreshToken: null }, { where: { id: req.user.id } })

	res.cookie('token', 'none', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	})

	res.status(200).json({
		success: true,
		message: 'Tizimdan muvaffaqiyatli chiqdingiz',
	})
})

// @desc    Get me
// @route   GET /api/v1/auth/me
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findByPk(req.user.id)
	res.status(200).json({ success: true, data: user })
})

const {
	uploadToCloudinary,
	deleteFromCloudinary,
} = require('../config/cloudinary.config')

// ... (existing code)

// @desc    Upload avatar
// @route   PUT /api/v1/auth/avatar
exports.uploadAvatar = asyncHandler(async (req, res, next) => {
	if (!req.file) return next(new ErrorResponse('Rasm fayli yuklang', 400))

	const user = await User.findByPk(req.user.id)

	if (user.avatar && user.avatar.publicId) {
		await deleteFromCloudinary(user.avatar.publicId)
	}

	// Multer CloudinaryStorage ishlatilgani uchun rasm allaqachon yuklangan
	const result = {
		url: req.file.path,
		publicId: req.file.filename,
	}

	user.avatar = result
	user.changed('avatar', true)
	await user.save()

	res.status(200).json({ success: true, message: 'Avatar yuklandi', data: user })
})

// @desc    Delete avatar
// @route   DELETE /api/v1/auth/avatar
exports.deleteAvatar = asyncHandler(async (req, res, next) => {
	const user = await User.findByPk(req.user.id)

	if (user.avatar && user.avatar.publicId) {
		await deleteFromCloudinary(user.avatar.publicId)
	}

	user.avatar = null
	user.changed('avatar', true)
	await user.save()

	res.status(200).json({ success: true, message: "Avatar o'chirildi", data: user })
})

// @desc    Update details
// @route   PUT /api/v1/auth/update-details
exports.updateDetails = asyncHandler(async (req, res, next) => {
	const fieldsToUpdate = {}
	if (req.body.name) fieldsToUpdate.name = req.body.name
	if (req.body.email) fieldsToUpdate.email = req.body.email
	// Avatar alohida endpoint orqali yuklanadi

	await User.update(fieldsToUpdate, { where: { id: req.user.id } })
	const user = await User.findByPk(req.user.id)

	res.status(200).json({ success: true, data: user })
})

// @desc    Update password
// @route   PUT /api/v1/auth/update-password
exports.updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.scope('withPassword').findByPk(req.user.id)

	if (!(await user.matchPassword(req.body.currentPassword))) {
		return next(new ErrorResponse("Joriy parol noto'g'ri", 401))
	}

	user.password = req.body.newPassword
	await user.save()

	sendTokenResponse(user, 200, res)
})

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh-token
exports.refreshToken = asyncHandler(async (req, res, next) => {
	const { refreshToken } = req.body

	if (!refreshToken) {
		return next(new ErrorResponse('Refresh token kiritish majburiy', 400))
	}

	const jwt = require('jsonwebtoken')

	try {
		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
		)

		const user = await User.scope('withPassword').findByPk(decoded.id)

		if (!user || user.refreshToken !== refreshToken) {
			return next(new ErrorResponse('Refresh token yaroqsiz', 401))
		}

		const newRefreshToken = user.getRefreshToken()
		user.refreshToken = newRefreshToken
		await user.save()

		sendTokenResponse(user, 200, res)
	} catch (err) {
		return next(new ErrorResponse("Refresh token yaroqsiz yoki muddati o'tgan", 401))
	}
})
