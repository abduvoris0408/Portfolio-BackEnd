const Joi = require('joi')
const objectId = Joi.string().uuid().message("Noto'g'ri ID format")

const createSchema = Joi.object({
    blogPostId: objectId.required(),
    parentCommentId: objectId.allow(null),
    guestName: Joi.string().max(100).trim().required(),
    guestEmail: Joi.string().email().required(),
    content: Joi.string().max(2000).required(),
})

const updateStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'approved', 'rejected').required(),
})

module.exports = { createSchema, updateStatusSchema }
