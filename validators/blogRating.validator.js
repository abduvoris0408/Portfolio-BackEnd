const Joi = require('joi')
const objectId = Joi.string().uuid().message("Noto'g'ri ID format")

const createSchema = Joi.object({
    blogPostId: objectId.required(),
    rating: Joi.number().min(1).max(5).required().messages({
        'number.min': "Reyting kamida 1 bo'lishi kerak",
        'number.max': "Reyting ko'pi bilan 5 bo'lishi kerak",
        'any.required': 'Reyting kiritish majburiy',
    }),
})

module.exports = { createSchema }
