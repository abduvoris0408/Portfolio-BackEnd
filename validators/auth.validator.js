const Joi = require('joi')

// Login
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': "Email formati noto'g'ri",
        'any.required': 'Email kiritish majburiy',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
        'any.required': 'Parol kiritish majburiy',
    }),
})

// Update password
const updatePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'any.required': 'Joriy parolni kiritish majburiy',
    }),
    newPassword: Joi.string().min(6).required().messages({
        'string.min': "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak",
        'any.required': 'Yangi parolni kiritish majburiy',
    }),
})

// Update details
const updateDetailsSchema = Joi.object({
    name: Joi.string().min(2).max(50).trim(),
    email: Joi.string().email(),
    avatar: Joi.string(),
})

module.exports = {
    loginSchema,
    updatePasswordSchema,
    updateDetailsSchema,
}
