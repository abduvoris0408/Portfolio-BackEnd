const Joi = require('joi')

// Create yoki Update schema
const createOrUpdateSchema = Joi.object({
    fullName: Joi.string().max(100).trim(),
    title: Joi.string().max(150).trim(),
    subtitle: Joi.string().max(200).trim().allow(''),
    typingTexts: Joi.array().items(Joi.string().trim().max(100)),
    bio: Joi.string().max(5000),
    shortBio: Joi.string().max(500).allow(''),
    phone: Joi.string().trim().allow(''),
    email: Joi.string().email().trim().lowercase().allow(''),
    address: Joi.string().max(300).trim().allow(''),
    birthday: Joi.date().iso(),
    nationality: Joi.string().trim().allow(''),
    freelanceStatus: Joi.string().valid('available', 'busy', 'not_available'),
    location: Joi.object({
        city: Joi.string().trim().allow(''),
        country: Joi.string().trim().allow(''),
        mapUrl: Joi.string().uri().trim().allow(''),
    }),
    languages: Joi.array().items(
        Joi.object({
            name: Joi.string().trim().required(),
            level: Joi.string().valid('native', 'fluent', 'advanced', 'intermediate', 'basic'),
        }),
    ),
    socialLinks: Joi.object({
        github: Joi.string().uri().trim().allow(''),
        linkedin: Joi.string().uri().trim().allow(''),
        telegram: Joi.string().uri().trim().allow(''),
        twitter: Joi.string().uri().trim().allow(''),
        facebook: Joi.string().uri().trim().allow(''),
        instagram: Joi.string().uri().trim().allow(''),
        youtube: Joi.string().uri().trim().allow(''),
        website: Joi.string().uri().trim().allow(''),
        leetcode: Joi.string().uri().trim().allow(''),
        stackoverflow: Joi.string().uri().trim().allow(''),
        dribbble: Joi.string().uri().trim().allow(''),
        behance: Joi.string().uri().trim().allow(''),
    }),
    stats: Joi.object({
        projectsCompleted: Joi.number().integer().min(0),
        happyClients: Joi.number().integer().min(0),
        yearsExperience: Joi.number().integer().min(0),
        awardsWon: Joi.number().integer().min(0),
        coffeesDrunk: Joi.number().integer().min(0),
        linesOfCode: Joi.number().integer().min(0),
    }),
    interests: Joi.array().items(
        Joi.object({
            name: Joi.string().trim().required(),
            icon: Joi.string().trim().allow(''),
        }),
    ),
    whatIDo: Joi.array().items(
        Joi.object({
            title: Joi.string().trim().required(),
            description: Joi.string().trim().allow(''),
            icon: Joi.string().trim().allow(''),
            order: Joi.number().integer().min(0),
        }),
    ),
    seo: Joi.object({
        metaTitle: Joi.string().trim().max(70).allow(''),
        metaDescription: Joi.string().trim().max(160).allow(''),
        metaKeywords: Joi.array().items(Joi.string().trim()),
        ogImage: Joi.string().uri().trim().allow(''),
    }),
    isActive: Joi.boolean(),
})

module.exports = {
    createOrUpdateSchema,
}
