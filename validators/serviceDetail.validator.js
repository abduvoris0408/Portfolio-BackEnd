const Joi = require('joi')
const objectId = Joi.string().uuid().message("Noto'g'ri ID format")

const createSchema = Joi.object({
    serviceId: objectId.required(),
    title: Joi.string().max(150).trim().required(),
    description: Joi.string().max(1000).allow(''),
    icon: Joi.string().trim().allow(''),
    order: Joi.number().min(0),
})

const updateSchema = Joi.object({
    serviceId: objectId,
    title: Joi.string().max(150).trim(),
    description: Joi.string().max(1000).allow(''),
    icon: Joi.string().trim().allow(''),
    order: Joi.number().min(0),
})

module.exports = { createSchema, updateSchema }
