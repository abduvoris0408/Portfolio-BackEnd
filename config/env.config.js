require('dotenv').config()

module.exports = {
	port: process.env.PORT || 5000,
	nodeEnv: process.env.NODE_ENV || 'development',
	mongodbUri: process.env.MONGODB_URI || '',
	api: {
		version: process.env.API_VERSION || 'v1',
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
	jwt: {
		secret: process.env.JWT_SECRET,
		expire: process.env.JWT_EXPIRE || '1d',
		refreshSecret: process.env.JWT_REFRESH_SECRET,
		refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
		cookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE) || 7,
	},
	admin: {
		name: process.env.ADMIN_NAME || 'Admin',
		email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
		password: process.env.ADMIN_PASSWORD || 'admin123456',
	},
	logging: {
		level: process.env.LOG_LEVEL || 'info',
	},
}
