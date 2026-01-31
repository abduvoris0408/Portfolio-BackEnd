const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const Skill = require('../models/Skill')

// @desc    Get all skills
// @route   GET /api/v1/skills
// @access  Public
exports.getSkills = asyncHandler(async (req, res, next) => {
	let query

	// Copy req.query
	const reqQuery = { ...req.query }

	// Fields to exclude
	const removeFields = ['select', 'sort', 'page', 'limit']

	// Loop over removeFields and delete them from reqQuery
	removeFields.forEach(param => delete reqQuery[param])

	// Create query string
	let queryStr = JSON.stringify(reqQuery)

	// Create operators ($gt, $gte, etc)
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

	// Finding resource
	query = Skill.find(JSON.parse(queryStr)).populate('user', 'name email')

	// Select Fields
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ')
		query = query.select(fields)
	}

	// Sort
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ')
		query = query.sort(sortBy)
	} else {
		query = query.sort('order')
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1
	const limit = parseInt(req.query.limit, 10) || 50
	const startIndex = (page - 1) * limit
	const endIndex = page * limit
	const total = await Skill.countDocuments()

	query = query.skip(startIndex).limit(limit)

	// Executing query
	const skills = await query

	// Pagination result
	const pagination = {}

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		}
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		}
	}

	res.status(200).json({
		success: true,
		count: skills.length,
		pagination,
		data: skills,
	})
})

// @desc    Get single skill
// @route   GET /api/v1/skills/:id
// @access  Public
exports.getSkill = asyncHandler(async (req, res, next) => {
	const skill = await Skill.findById(req.params.id).populate(
		'user',
		'name email',
	)

	if (!skill) {
		return next(new ErrorResponse(`Skill topilmadi: ${req.params.id}`, 404))
	}

	res.status(200).json({
		success: true,
		data: skill,
	})
})

// @desc    Create new skill
// @route   POST /api/v1/skills
// @access  Private
exports.createSkill = asyncHandler(async (req, res, next) => {
	// Add user to req.body
	req.body.user = req.user.id

	const skill = await Skill.create(req.body)

	res.status(201).json({
		success: true,
		data: skill,
	})
})

// @desc    Update skill
// @route   PUT /api/v1/skills/:id
// @access  Private
exports.updateSkill = asyncHandler(async (req, res, next) => {
	let skill = await Skill.findById(req.params.id)

	if (!skill) {
		return next(new ErrorResponse(`Skill topilmadi: ${req.params.id}`, 404))
	}

	// Make sure user is skill owner
	if (skill.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.user.id} bu skillni yangilash huquqiga ega emas`,
				401,
			),
		)
	}

	skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	})

	res.status(200).json({
		success: true,
		data: skill,
	})
})

// @desc    Delete skill
// @route   DELETE /api/v1/skills/:id
// @access  Private
exports.deleteSkill = asyncHandler(async (req, res, next) => {
	const skill = await Skill.findById(req.params.id)

	if (!skill) {
		return next(new ErrorResponse(`Skill topilmadi: ${req.params.id}`, 404))
	}

	// Make sure user is skill owner
	if (skill.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.user.id} bu skillni o'chirish huquqiga ega emas`,
				401,
			),
		)
	}

	await skill.deleteOne()

	res.status(200).json({
		success: true,
		data: {},
	})
})
