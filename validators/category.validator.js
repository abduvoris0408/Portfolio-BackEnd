const Joi = require('joi')

const createSchema = Joi.object({
    name: Joi.string().max(50).trim().required().messages({
        'any.required': 'Kategoriya nomi kiritish majburiy',
    }),
    description: Joi.string().max(500).allow(''),
    icon: Joi.string().trim().allow(''),
    color: Joi.string().allow(''),
    type: Joi.string().valid('project', 'blog', 'service', 'skill', 'news').required().messages({
        'any.required': 'Kategoriya turi kiritish majburiy',
        'any.only': "Kategoriya turi noto'g'ri",
    }),
    order: Joi.number().min(0),
    isActive: Joi.boolean(),
})

const updateSchema = Joi.object({
    name: Joi.string().max(50).trim(),
    description: Joi.string().max(500).allow(''),
    icon: Joi.string().trim().allow(''),
    color: Joi.string().allow(''),
    type: Joi.string().valid('project', 'blog', 'service', 'skill', 'news'),
    order: Joi.number().min(0),
    isActive: Joi.boolean(),
})

module.exports = { createSchema, updateSchema }
