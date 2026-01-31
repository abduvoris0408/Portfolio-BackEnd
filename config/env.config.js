require('dotenv').config() // hozircha qoldiring yoki o'chiring

module.exports = {
	port: process.env.PORT || 5000,
	nodeEnv: process.env.NODE_ENV || 'development',
	mongodbUri: process.env.MONGODB_URI || '', // <--- YANGI QATOR
	api: {
		version: process.env.API_VERSION || 'v2',
		prefix: process.env.API_PREFIX || '/api',
	},
	cors: {
		origin: process.env.CORS_ORIGIN || '*',
		credentials: true,
	},
	rateLimit: {
		windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
		max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
	},
	logging: {
		level: process.env.LOG_LEVEL || 'info',
	},
}
