const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const Project = require('../models/Project')

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Public
exports.getProjects = asyncHandler(async (req, res, next) => {
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
	query = Project.find(JSON.parse(queryStr))
		.populate({
			path: 'user',
			select: 'name email',
		})
		.populate({
			path: 'category',
			select: 'name slug',
		})

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
		query = query.sort('-createdAt')
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1
	const limit = parseInt(req.query.limit, 10) || 10
	const startIndex = (page - 1) * limit
	const endIndex = page * limit
	const total = await Project.countDocuments()

	query = query.skip(startIndex).limit(limit)

	// Executing query
	const projects = await query

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
		count: projects.length,
		pagination,
		data: projects,
	})
})

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Public
exports.getProject = asyncHandler(async (req, res, next) => {
	const project = await Project.findById(req.params.id)
		.populate('user', 'name email')
		.populate('category', 'name slug')

	if (!project) {
		return next(
			new ErrorResponse(`Project topilmadi: ${req.params.id}`, 404),
		)
	}

	res.status(200).json({
		success: true,
		data: project,
	})
})

// @desc    Create new project
// @route   POST /api/v1/projects
// @access  Private
exports.createProject = asyncHandler(async (req, res, next) => {
	// Add user to req.body
	req.body.user = req.user.id

	const project = await Project.create(req.body)

	res.status(201).json({
		success: true,
		data: project,
	})
})

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res, next) => {
	let project = await Project.findById(req.params.id)

	if (!project) {
		return next(
			new ErrorResponse(`Project topilmadi: ${req.params.id}`, 404),
		)
	}

	// Make sure user is project owner
	if (project.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.user.id} bu projectni yangilash huquqiga ega emas`,
				401,
			),
		)
	}

	project = await Project.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	})

	res.status(200).json({
		success: true,
		data: project,
	})
})

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private
exports.deleteProject = asyncHandler(async (req, res, next) => {
	const project = await Project.findById(req.params.id)

	if (!project) {
		return next(
			new ErrorResponse(`Project topilmadi: ${req.params.id}`, 404),
		)
	}

	// Make sure user is project owner
	if (project.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.user.id} bu projectni o'chirish huquqiga ega emas`,
				401,
			),
		)
	}

	await project.deleteOne()

	res.status(200).json({
		success: true,
		data: {},
	})
})
