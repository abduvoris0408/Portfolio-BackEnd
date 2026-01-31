const logger = require('../utils/logger')
const ErrorResponse = require('../utils/ErrorResponse')

const errorHandler = (err, req, res, next) => {
	let error = { ...err }
	error.message = err.message

	// Log qilish
	logger.error(err)

	// Mongoose bad ObjectId
	if (err.name === 'CastError') {
		const message = "Ma'lumot topilmadi"
		error = new ErrorResponse(message, 404)
	}

	// Mongoose duplicate key
	if (err.code === 11000) {
		const field = Object.keys(err.keyValue)[0]
		const message = `${field} allaqachon mavjud`
		error = new ErrorResponse(message, 400)
	}

	// Mongoose validation error
	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map(val => val.message)
		error = new ErrorResponse(message, 400)
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Server xatosi',
	})
}

module.exports = errorHandler
