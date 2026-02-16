const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

const cookieParser = require('cookie-parser')

const config = require('./config/env.config')
const logger = require('./utils/logger')
const { sequelize } = require('./models')
const { connectDB } = require('./config/db.config')
const errorHandler = require('./middleware/errorHandler')
const seedAdmin = require('./data/seed')

const app = express()

// ===== Security Middleware =====
app.use(helmet())

app.use(cors({
	origin: config.cors.origin,
	credentials: config.cors.credentials,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}))



// PostgreSQL parameterized queries orqali SQL injection himoyalangan

// ===== Body Parser Middleware =====
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// ===== Request Logging (Development) =====
if (config.nodeEnv === 'development') {
	const morgan = require('morgan')
	app.use(morgan('dev'))
}

// ===== Root & Health =====
app.get('/', (req, res) => {
	res.json({
		message: 'Portfolio API ishlamoqda!',
		version: config.api.version,
		status: 'active',
		documentation: '/api-docs',
	})
})

app.get('/health', (req, res) => {
	res.json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		environment: config.nodeEnv,
	})
})

// ===== API Routes =====
const apiPrefix = `${config.api.prefix}/${config.api.version}`

// Auth (with stricter rate limit)
app.use(`${apiPrefix}/auth`, require('./routes/auth.routes'))

// Content routes
app.use(`${apiPrefix}/about`, require('./routes/about.routes'))
app.use(`${apiPrefix}/categories`, require('./routes/category.routes'))
app.use(`${apiPrefix}/services`, require('./routes/service.routes'))
app.use(`${apiPrefix}/service-details`, require('./routes/serviceDetail.routes'))
app.use(`${apiPrefix}/projects`, require('./routes/project.routes'))
app.use(`${apiPrefix}/skills`, require('./routes/skill.routes'))
app.use(`${apiPrefix}/blog-posts`, require('./routes/blogPost.routes'))
app.use(`${apiPrefix}/blog-comments`, require('./routes/blogComment.routes'))
app.use(`${apiPrefix}/blog-ratings`, require('./routes/blogRating.routes'))
app.use(`${apiPrefix}/news`, require('./routes/news.routes'))
app.use(`${apiPrefix}/tags`, require('./routes/tag.routes'))
app.use(`${apiPrefix}/experiences`, require('./routes/experience.routes'))
app.use(`${apiPrefix}/education`, require('./routes/education.routes'))
app.use(`${apiPrefix}/contacts`, require('./routes/contact.routes'))
app.use(`${apiPrefix}/testimonials`, require('./routes/testimonial.routes'))
app.use(`${apiPrefix}/faqs`, require('./routes/faq.routes'))
app.use(`${apiPrefix}/partners`, require('./routes/partner.routes'))
app.use(`${apiPrefix}/consultations`, require('./routes/consultation.routes'))
app.use(`${apiPrefix}/achievements`, require('./routes/achievement.routes'))
app.use(`${apiPrefix}/dashboard`, require('./routes/dashboard.routes'))

// 404 handler
app.use((req, res) => {
	res.status(404).json({
		success: false,
		message: 'Route topilmadi',
		path: req.path,
	})
})

// Error handler
app.use(errorHandler)

// ===== Server va Database =====
const startServer = async () => {
	try {
		// PostgreSQL ulanish
		await connectDB()

		// Jadvallarni yaratish/yangilash
		await sequelize.sync({ alter: true })
		logger.info('📋 Jadvallar sinxronlashtirildi!')

		// Admin seed
		await seedAdmin()

		const PORT = config.port
		app.listen(PORT, () => {
			logger.info(`🚀 Server ishga tushdi: http://localhost:${PORT}`)
			logger.info(`📚 API: http://localhost:${PORT}${apiPrefix}`)
			logger.info(`🌍 Environment: ${config.nodeEnv}`)
			logger.info(`🐘 Database: PostgreSQL (${process.env.DB_NAME})`)
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

process.on('unhandledRejection', (err) => {
	logger.error(`Unhandled Rejection: ${err.message}`)
	process.exit(1)
})

startServer()

module.exports = app
