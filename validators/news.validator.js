const Joi = require('joi')
const objectId = Joi.string().uuid().message("Noto'g'ri ID format")

const createSchema = Joi.object({
    title: Joi.string().max(200).trim().required(),
    content: Joi.string().required(),
    excerpt: Joi.string().max(500).allow(''),
    coverImage: Joi.string().allow(''),
    categoryId: objectId,
    tags: Joi.array().items(objectId),
    status: Joi.string().valid('draft', 'published', 'archived'),
    isFeatured: Joi.boolean(),
    source: Joi.string().trim().allow(''),
    sourceUrl: Joi.string().trim().allow(''),
})

const updateSchema = Joi.object({
    title: Joi.string().max(200).trim(),
    content: Joi.string(),
    excerpt: Joi.string().max(500).allow(''),
    coverImage: Joi.string().allow(''),
    categoryId: objectId,
    tags: Joi.array().items(objectId),
    status: Joi.string().valid('draft', 'published', 'archived'),
    isFeatured: Joi.boolean(),
    source: Joi.string().trim().allow(''),
    sourceUrl: Joi.string().trim().allow(''),
})

module.exports = { createSchema, updateSchema }
