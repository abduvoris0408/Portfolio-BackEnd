const { body, validationResult } = require('express-validator')

// Validation natijalarini tekshirish
exports.validate = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			errors: errors.array().map(err => ({
				field: err.path,
				message: err.msg,
			})),
		})
	}
	next()
}

// Register validation
exports.registerValidation = [
	body('name')
		.trim()
		.notEmpty()
		.withMessage('Ism kiritish majburiy')
		.isLength({ min: 2, max: 50 })
		.withMessage("Ism 2 dan 50 ta belgigacha bo'lishi kerak"),
	body('email')
		.trim()
		.notEmpty()
		.withMessage('Email kiritish majburiy')
		.isEmail()
		.withMessage("Email formati noto'g'ri")
		.normalizeEmail(),
	body('password')
		.notEmpty()
		.withMessage('Parol kiritish majburiy')
		.isLength({ min: 6 })
		.withMessage("Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
]

// Login validation
exports.loginValidation = [
	body('email')
		.trim()
		.notEmpty()
		.withMessage('Email kiritish majburiy')
		.isEmail()
		.withMessage("Email formati noto'g'ri")
		.normalizeEmail(),
	body('password').notEmpty().withMessage('Parol kiritish majburiy'),
]

// Project validation
exports.projectValidation = [
	body('title')
		.trim()
		.notEmpty()
		.withMessage('Loyiha nomi kiritish majburiy')
		.isLength({ max: 100 })
		.withMessage('Loyiha nomi 100 ta belgidan oshmasligi kerak'),
	body('description')
		.trim()
		.notEmpty()
		.withMessage('Tavsif kiritish majburiy')
		.isLength({ max: 2000 })
		.withMessage('Tavsif 2000 ta belgidan oshmasligi kerak'),
	body('category').notEmpty().withMessage('Kategoriya tanlash majburiy'),
]

// Skill validation
exports.skillValidation = [
	body('name')
		.trim()
		.notEmpty()
		.withMessage('Skill nomi kiritish majburiy')
		.isLength({ max: 50 })
		.withMessage('Skill nomi 50 ta belgidan oshmasligi kerak'),
	body('level')
		.optional()
		.isIn(['beginner', 'intermediate', 'advanced', 'expert'])
		.withMessage("Level noto'g'ri"),
	body('percentage')
		.optional()
		.isInt({ min: 0, max: 100 })
		.withMessage("Foiz 0 dan 100 gacha bo'lishi kerak"),
]

// Category validation
exports.categoryValidation = [
	body('name')
		.trim()
		.notEmpty()
		.withMessage('Kategoriya nomi kiritish majburiy')
		.isLength({ max: 50 })
		.withMessage('Kategoriya nomi 50 ta belgidan oshmasligi kerak'),
	body('description')
		.optional()
		.isLength({ max: 500 })
		.withMessage('Tavsif 500 ta belgidan oshmasligi kerak'),
]
