const { Sequelize } = require('sequelize')
const logger = require('../utils/logger')

const sequelize = new Sequelize(
	process.env.DB_NAME || 'example_db',
	process.env.DB_USER || 'postgres',
	process.env.DB_PASSWORD || '',
	{
		host: process.env.DB_HOST || 'localhost',
		port: parseInt(process.env.DB_PORT) || 5432,
		dialect: 'postgres',
		logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
		pool: {
			max: 10,
			min: 2,
			acquire: 30000,
			idle: 10000,
		},
		define: {
			timestamps: true,
			underscored: true, // snake_case column nomlari
			freezeTableName: true,
		},
	},
)

const connectDB = async () => {
	try {
		await sequelize.authenticate()
		logger.info('PostgreSQL muvaffaqiyatli ulandi! 🐘')
		return sequelize
	} catch (error) {
		logger.error(`PostgreSQL ulanish xatosi: ${error.message}`)
		throw error
	}
}

module.exports = { sequelize, connectDB }
