const portfolioData = require('../data/portfolioData')
const { asyncHandler, AppError } = require('../middleware/errorHandler')
const logger = require('../utils/logger')

const getAllProjects = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10 } = req.query

	const startIndex = (page - 1) * limit
	const endIndex = page * limit
	const projects = portfolioData.projects.slice(startIndex, endIndex)

	logger.info('Projectlar olindi')

	res.json({
		success: true,
		count: projects.length,
		total: portfolioData.projects.length,
		pagination: {
			current: parseInt(page),
			pages: Math.ceil(portfolioData.projects.length / limit),
		},
		data: projects,
	})
})

const getProjectById = asyncHandler(async (req, res, next) => {
	const id = parseInt(req.params.id)
	const project = portfolioData.projects.find(p => p.id === id)

	if (!project) {
		return next(new AppError(`Loyiha topilmadi (ID: ${id})`, 404))
	}

	logger.info(`Project olindi: ${id}`)

	res.json({
		success: true,
		data: project,
	})
})

module.exports = { getAllProjects, getProjectById }
