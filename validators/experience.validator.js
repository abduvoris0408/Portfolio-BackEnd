const Joi = require('joi')

const createSchema = Joi.object({
    company: Joi.string().max(100).trim().required(),
    position: Joi.string().max(100).trim().required(),
    location: Joi.string().max(100).trim().allow(''),
    description: Joi.string().max(2000).allow(''),
    startDate: Joi.date().required(),
    endDate: Joi.date().allow(null),
    current: Joi.boolean(),
    technologies: Joi.array().items(Joi.string().trim()),
    companyLogo: Joi.string().trim().allow(''),
    companyUrl: Joi.string().trim().allow(''),
    order: Joi.number().min(0),
})

const updateSchema = Joi.object({
    company: Joi.string().max(100).trim(),
    position: Joi.string().max(100).trim(),
    location: Joi.string().max(100).trim().allow(''),
    description: Joi.string().max(2000).allow(''),
    startDate: Joi.date(),
    endDate: Joi.date().allow(null),
    current: Joi.boolean(),
    technologies: Joi.array().items(Joi.string().trim()),
    companyLogo: Joi.string().trim().allow(''),
    companyUrl: Joi.string().trim().allow(''),
    order: Joi.number().min(0),
})

module.exports = { createSchema, updateSchema }
