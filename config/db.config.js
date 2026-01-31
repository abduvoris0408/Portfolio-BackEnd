const mongoose = require('mongoose')
const config = require('./env.config')
const logger = require('../utils/logger')

const connectDB = async () => {
	try {
		await mongoose.connect(config.mongodbUri)
		logger.info('MongoDB muvaffaqiyatli ulandi! 🚀')
	} catch (err) {
		logger.error(`MongoDB ulanmadi: ${err.message}`)
		process.exit(1)
	}
}

module.exports = connectDB
