const express = require('express')
const config = require('./config/env.config')
const logger = require('./utils/logger')
const connectDB = require('./config/db.config')

const app = express()
const cookieParser = require('cookie-parser')
// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
// CORS middleware (kerak bo'lsa)
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', config.cors.origin)
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	res.header('Access-Control-Allow-Credentials', config.cors.credentials)

	if (req.method === 'OPTIONS') {
		return res.sendStatus(200)
	}
	next()
})

// Routes
app.get('/', (req, res) => {
	res.json({
		message: 'Portfolio API ishlamoqda!',
		version: config.api.version,
		status: 'active',
	})
})

// Health check endpoint
app.get('/health', (req, res) => {
	res.json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	})
})

// API routes (keyinchalik qo'shiladi)
// app.use(`${config.api.prefix}/${config.api.version}/projects`, projectRoutes)
// app.use(`${config.api.prefix}/${config.api.version}/skills`, skillRoutes)
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const projectRoutes = require('./routes/project.routes')
const skillRoutes = require('./routes/skill.routes')
const categoryRoutes = require('./routes/category.routes')
const swaggerDocs = require('./config/swagger.config')

// Mount routes
app.use(`${config.api.prefix}/${config.api.version}/auth`, authRoutes)
app.use(`${config.api.prefix}/${config.api.version}/users`, userRoutes)
app.use(`${config.api.prefix}/${config.api.version}/projects`, projectRoutes)
app.use(`${config.api.prefix}/${config.api.version}/skills`, skillRoutes)
app.use(`${config.api.prefix}/${config.api.version}/categories`, categoryRoutes)
// 404 handler
swaggerDocs(app)
app.use((req, res) => {
	res.status(404).json({
		success: false,
		message: 'Route topilmadi',
		path: req.path,
	})
})

// Error handler
app.use((err, req, res, next) => {
	logger.error(`Error: ${err.message}`)
	res.status(err.status || 500).json({
		success: false,
		message: err.message || 'Server xatosi',
		...(config.nodeEnv === 'development' && { stack: err.stack }),
	})
})

// Server va Database ishga tushirish
const startServer = async () => {
	try {
		// MongoDB'ga ulanish
		await connectDB()

		// Serverni ishga tushirish
		const PORT = config.port
		app.listen(PORT, () => {
			logger.info(`🚀 Server ishga tushdi: http://localhost:${PORT}`)
			logger.info(`📚 API: http://localhost:${PORT}${config.api.prefix}`)
			logger.info(`🌍 Environment: ${config.nodeEnv}`)
		})
	} catch (error) {
		logger.error(`Server ishga tushmadi: ${error.message}`)
		process.exit(1)
	}
}

// Graceful shutdown
process.on('SIGTERM', () => {
	logger.info('SIGTERM signal qabul qilindi, server yopilmoqda...')
	process.exit(0)
})

process.on('SIGINT', () => {
	logger.info('SIGINT signal qabul qilindi, server yopilmoqda...')
	process.exit(0)
})

startServer()

module.exports = app
