const jwt = require('jsonwebtoken')
const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const User = require('../models/User')

// Protect routes - faqat login qilgan userlar uchun
exports.protect = asyncHandler(async (req, res, next) => {
	let token

	// Token'ni headerdan yoki cookie'dan olish
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		// Bearer token
		token = req.headers.authorization.split(' ')[1]
	} else if (req.cookies.token) {
		// Cookie'dan token
		token = req.cookies.token
	}

	// Token mavjudligini tekshirish
	if (!token) {
		return next(
			new ErrorResponse("Ushbu route'ga kirish uchun login qiling", 401),
		)
	}

	try {
		// Token'ni verify qilish
		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		// User'ni topish
		req.user = await User.findById(decoded.id)

		if (!req.user) {
			return next(new ErrorResponse('User topilmadi', 404))
		}

		next()
	} catch (err) {
		return next(
			new ErrorResponse("Token yaroqsiz yoki muddati o'tgan", 401),
		)
	}
})

// Role tekshirish - faqat admin uchun
exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					`${req.user.role} roli ushbu route'ga kira olmaydi`,
					403,
				),
			)
		}
		next()
	}
}
