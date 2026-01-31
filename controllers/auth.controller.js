const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const User = require('../models/User')
const sendTokenResponse = require('../utils/jwt')

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body

	// User yaratish
	const user = await User.create({
		name,
		email,
		password,
		role,
	})

	sendTokenResponse(user, 201, res)
})

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body

	// Email va parol kiritilganligini tekshirish
	if (!email || !password) {
		return next(new ErrorResponse('Email va parolni kiriting', 400))
	}

	// User'ni topish (parol bilan)
	const user = await User.findOne({ email }).select('+password')

	if (!user) {
		return next(new ErrorResponse("Email yoki parol noto'g'ri", 401))
	}

	// Parolni tekshirish
	const isMatch = await user.matchPassword(password)

	if (!isMatch) {
		return next(new ErrorResponse("Email yoki parol noto'g'ri", 401))
	}

	sendTokenResponse(user, 200, res)
})

// @desc    Logout user / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
	res.cookie('token', 'none', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	})

	res.status(200).json({
		success: true,
		data: {},
	})
})

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id)

	res.status(200).json({
		success: true,
		data: user,
	})
})

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
	const fieldsToUpdate = {
		name: req.body.name,
		email: req.body.email,
	}

	const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
		new: true,
		runValidators: true,
	})

	res.status(200).json({
		success: true,
		data: user,
	})
})

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password')

	// Hozirgi parolni tekshirish
	if (!(await user.matchPassword(req.body.currentPassword))) {
		return next(new ErrorResponse("Parol noto'g'ri", 401))
	}

	user.password = req.body.newPassword
	await user.save()

	sendTokenResponse(user, 200, res)
})
