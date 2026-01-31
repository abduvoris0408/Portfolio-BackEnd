const portfolioData = require('../data/portfolioData')
const { asyncHandler, AppError } = require('../middleware/errorHandler')
const logger = require('../utils/logger')

const getAllSkills = asyncHandler(async (req, res) => {
	logger.info('Barcha skilllar olindi')

	res.json({
		success: true,
		count: portfolioData.skills.length,
		data: portfolioData.skills,
	})
})

const getSkillById = asyncHandler(async (req, res, next) => {
	const id = parseInt(req.params.id)
	const skill = portfolioData.skills.find(s => s.id === id)

	if (!skill) {
		return next(new AppError(`Skill topilmadi (ID: ${id})`, 404))
	}

	logger.info(`Skill olindi: ${id}`)

	res.json({
		success: true,
		data: skill,
	})
})

module.exports = { getAllSkills, getSkillById }
