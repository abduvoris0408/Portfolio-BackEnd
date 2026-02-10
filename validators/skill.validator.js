const Joi = require('joi')
const objectId = Joi.string().uuid().message("Noto'g'ri ID format")

const createSchema = Joi.object({
    name: Joi.string().max(50).trim().required(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert'),
    percentage: Joi.number().min(0).max(100),
    icon: Joi.string().trim().allow(''),
    categoryId: objectId,
    order: Joi.number().min(0),
    isActive: Joi.boolean(),
})

const updateSchema = Joi.object({
    name: Joi.string().max(50).trim(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert'),
    percentage: Joi.number().min(0).max(100),
    icon: Joi.string().trim().allow(''),
    categoryId: objectId,
    order: Joi.number().min(0),
    isActive: Joi.boolean(),
})

module.exports = { createSchema, updateSchema }
