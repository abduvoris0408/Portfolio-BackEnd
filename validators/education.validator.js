const Joi = require('joi')

const createSchema = Joi.object({
    school: Joi.string().max(150).trim().required(),
    degree: Joi.string().max(100).trim().required(),
    fieldOfStudy: Joi.string().max(100).trim().required(),
    location: Joi.string().max(100).trim().allow(''),
    description: Joi.string().max(1000).allow(''),
    startDate: Joi.date().required(),
    endDate: Joi.date().allow(null),
    current: Joi.boolean(),
    grade: Joi.string().max(20).trim().allow(''),
    schoolLogo: Joi.string().trim().allow(''),
    schoolUrl: Joi.string().trim().allow(''),
    order: Joi.number().min(0),
})

const updateSchema = Joi.object({
    school: Joi.string().max(150).trim(),
    degree: Joi.string().max(100).trim(),
    fieldOfStudy: Joi.string().max(100).trim(),
    location: Joi.string().max(100).trim().allow(''),
    description: Joi.string().max(1000).allow(''),
    startDate: Joi.date(),
    endDate: Joi.date().allow(null),
    current: Joi.boolean(),
    grade: Joi.string().max(20).trim().allow(''),
    schoolLogo: Joi.string().trim().allow(''),
    schoolUrl: Joi.string().trim().allow(''),
    order: Joi.number().min(0),
})

module.exports = { createSchema, updateSchema }
