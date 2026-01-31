const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const Category = require('../models/Category')

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
	const categories = await Category.find()
		.populate('user', 'name email')
		.populate('projectCount')

	res.status(200).json({
		success: true,
		count: categories.length,
		data: categories,
	})
})

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
	const category = await Category.findById(req.params.id)
		.populate('user', 'name email')
		.populate('projectCount')

	if (!category) {
		return next(
			new ErrorResponse(`Category topilmadi: ${req.params.id}`, 404),
		)
	}

	res.status(200).json({
		success: true,
		data: category,
	})
})

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res, next) => {
	// Add user to req.body
	req.body.user = req.user.id

	const category = await Category.create(req.body)

	res.status(201).json({
		success: true,
		data: category,
	})
})

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
	let category = await Category.findById(req.params.id)

	if (!category) {
		return next(
			new ErrorResponse(`Category topilmadi: ${req.params.id}`, 404),
		)
	}

	// Make sure user is category owner
	if (category.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.user.id} bu categoryni yangilash huquqiga ega emas`,
				401,
			),
		)
	}

	category = await Category.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	})

	res.status(200).json({
		success: true,
		data: category,
	})
})

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
	const category = await Category.findById(req.params.id)

	if (!category) {
		return next(
			new ErrorResponse(`Category topilmadi: ${req.params.id}`, 404),
		)
	}

	// Make sure user is category owner
	if (category.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.user.id} bu categoryni o'chirish huquqiga ega emas`,
				401,
			),
		)
	}

	await category.deleteOne()

	res.status(200).json({
		success: true,
		data: {},
	})
})
