const Joi = require('joi')

const createSchema = Joi.object({
    name: Joi.string().max(100).trim().required(),
    email: Joi.string().email().required(),
    subject: Joi.string().max(200).trim().required(),
    message: Joi.string().max(5000).required(),
    phone: Joi.string().max(20).trim().allow(''),
})

module.exports = { createSchema }
