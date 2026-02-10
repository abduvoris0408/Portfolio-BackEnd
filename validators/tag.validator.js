const Joi = require('joi')

const createSchema = Joi.object({
    name: Joi.string().max(50).trim().required(),
    color: Joi.string().allow(''),
})

const updateSchema = Joi.object({
    name: Joi.string().max(50).trim(),
    color: Joi.string().allow(''),
})

module.exports = { createSchema, updateSchema }
