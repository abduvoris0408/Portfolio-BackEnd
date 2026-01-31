const portfolioData = require('../data/portfolioData')
const { asyncHandler } = require('../middleware/errorHandler')
const logger = require('../utils/logger')

const getAbout = asyncHandler(async (req, res) => {
	logger.info("About ma'lumoti olindi")

	res.json({
		success: true,
		data: portfolioData.about,
	})
})

module.exports = { getAbout }
