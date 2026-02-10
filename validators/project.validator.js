const Joi = require('joi')
const objectId = Joi.string().uuid().message("Noto'g'ri ID format")

const createSchema = Joi.object({
    title: Joi.string().max(100).trim().required(),
    description: Joi.string().max(5000).required(),
    shortDescription: Joi.string().max(300).allow(''),
    image: Joi.string().allow(''),
    gallery: Joi.array().items(Joi.string()),
    clientUrl: Joi.string().trim().allow(''),
    categoryId: objectId.required(),
    status: Joi.string().valid('draft', 'published', 'archived'),
    isFeatured: Joi.boolean(),
    order: Joi.number().min(0),
    completedAt: Joi.date().allow(null),
})

const updateSchema = Joi.object({
    title: Joi.string().max(100).trim(),
    description: Joi.string().max(5000),
    shortDescription: Joi.string().max(300).allow(''),
    image: Joi.string().allow(''),
    gallery: Joi.array().items(Joi.string()),
    clientUrl: Joi.string().trim().allow(''),
    categoryId: objectId,
    status: Joi.string().valid('draft', 'published', 'archived'),
    isFeatured: Joi.boolean(),
    order: Joi.number().min(0),
    completedAt: Joi.date().allow(null),
})

module.exports = { createSchema, updateSchema }
