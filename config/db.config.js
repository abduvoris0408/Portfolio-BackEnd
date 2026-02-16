const { Sequelize } = require('sequelize')
const logger = require('../utils/logger')

const isProduction = process.env.NODE_ENV === 'production'

const dbOptions = {
	dialect: 'postgres',
	logging: isProduction ? false : (msg) => logger.debug(msg),
	pool: {
		max: 5,
		min: 0,
		acquire: 60000,
		idle: 10000,
	},
	define: {
		timestamps: true,
		underscored: true,
		freezeTableName: true,
	},
	dialectOptions: {
		ssl: isProduction
			? {
				require: true,
				rejectUnauthorized: false
			}
			: false
	},
	retry: {
		max: 3,
	},
}

// Render DATABASE_URL ni qo'llab-quvvatlash
const sequelize = process.env.DATABASE_URL
	? new Sequelize(process.env.DATABASE_URL, dbOptions)
	: new Sequelize(
		process.env.DB_NAME || 'example_db',
		process.env.DB_USER || 'postgres',
		process.env.DB_PASSWORD || '',
		{
			...dbOptions,
			host: process.env.DB_HOST || 'localhost',
			port: parseInt(process.env.DB_PORT) || 5432,
		}
	)

const connectDB = async () => {
	try {
		await sequelize.authenticate()
		logger.info('PostgreSQL muvaffaqiyatli ulandi! 🐘')
		return sequelize
	} catch (error) {
		logger.error(`PostgreSQL ulanish xatosi: ${error.message}`, { error })  // Batafsil log uchun
		throw error
	}
}

module.exports = { sequelize, connectDB }