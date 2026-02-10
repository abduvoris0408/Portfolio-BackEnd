const Joi = require('joi')
const objectId = Joi.string().uuid().message("Noto'g'ri ID format")

const createSchema = Joi.object({
    title: Joi.string().max(100).trim().required(),
    description: Joi.string().max(2000).required(),
    shortDescription: Joi.string().max(300).allow(''),
    icon: Joi.string().trim().allow(''),
    image: Joi.string().allow(''),
    categoryId: objectId,
    price: Joi.string().trim().allow(''),
    order: Joi.number().min(0),
    isActive: Joi.boolean(),
})

const updateSchema = Joi.object({
    title: Joi.string().max(100).trim(),
    description: Joi.string().max(2000),
    shortDescription: Joi.string().max(300).allow(''),
    icon: Joi.string().trim().allow(''),
    image: Joi.string().allow(''),
    categoryId: objectId,
    price: Joi.string().trim().allow(''),
    order: Joi.number().min(0),
    isActive: Joi.boolean(),
})

module.exports = { createSchema, updateSchema }
