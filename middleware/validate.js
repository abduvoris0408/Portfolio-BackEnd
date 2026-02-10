const ErrorResponse = require('../utils/ErrorResponse')

/**
 * Universal validation middleware
 * Joi schemani qabul qiladi va req.body/params/query ni tekshiradi
 *
 * @param {import('joi').ObjectSchema} schema - Joi schema
 * @param {string} source - 'body' | 'params' | 'query'
 */
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[source], {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true,
        })

        if (error) {
            const messages = error.details.map(detail => detail.message).join(', ')
            return next(new ErrorResponse(messages, 400))
        }

        // Validated va tozalangan ma'lumotni qaytarish
        req[source] = value
        next()
    }
}

module.exports = validate
