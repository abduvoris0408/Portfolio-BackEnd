const logger = require('../utils/logger')
const ErrorResponse = require('../utils/ErrorResponse')

const errorHandler = (err, req, res, next) => {
	let error = { ...err }
	error.message = err.message

	// Log qilish
	logger.error(`${err.name}: ${err.message}`)

	// Mongoose bad ObjectId
	if (err.name === 'CastError') {
		const message = "Ma'lumot topilmadi"
		error = new ErrorResponse(message, 404)
	}

	// Mongoose duplicate key
	if (err.code === 11000) {
		const field = Object.keys(err.keyValue)[0]
		const value = err.keyValue[field]
		const message = `${field} "${value}" allaqachon mavjud`
		error = new ErrorResponse(message, 400)
	}

	// Mongoose validation error
	if (err.name === 'ValidationError') {
		const messages = Object.values(err.errors).map(val => val.message)
		error = new ErrorResponse(messages.join(', '), 400)
	}

	// JWT errors
	if (err.name === 'JsonWebTokenError') {
		const message = 'Token yaroqsiz'
		error = new ErrorResponse(message, 401)
	}

	if (err.name === 'TokenExpiredError') {
		const message = "Token muddati o'tgan"
		error = new ErrorResponse(message, 401)
	}

	// Multer file size error
	if (err.code === 'LIMIT_FILE_SIZE') {
		const message = 'Fayl hajmi juda katta'
		error = new ErrorResponse(message, 400)
	}

	// Syntax Error (invalid JSON)
	if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
		const message = "JSON format noto'g'ri"
		error = new ErrorResponse(message, 400)
	}

	const statusCode = error.statusCode || 500
	const message = error.message || 'Server xatosi'

	res.status(statusCode).json({
		success: false,
		error: message,
		...(process.env.NODE_ENV === 'development' && {
			stack: err.stack,
			originalError: err.name,
		}),
	})
}

module.exports = errorHandler
