const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const ApiFeatures = require('../utils/apiFeatures')
const { Experience } = require('../models')
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary.config')

exports.getExperiences = asyncHandler(async (req, res, next) => {
    const features = new ApiFeatures(Experience, req.query)
        .filter()
        .search(['company', 'position', 'description'])
        .sort()
        .select()

    const { data, pagination } = await features.paginate()
    res.status(200).json({ success: true, count: data.length, pagination, data })
})

exports.getExperience = asyncHandler(async (req, res, next) => {
    const experience = await Experience.findByPk(req.params.id)
    if (!experience) return next(new ErrorResponse('Tajriba topilmadi', 404))
    res.status(200).json({ success: true, data: experience })
})

exports.createExperience = asyncHandler(async (req, res, next) => {
    const experience = await Experience.create(req.body)
    res.status(201).json({ success: true, data: experience })
})

exports.updateExperience = asyncHandler(async (req, res, next) => {
    const experience = await Experience.findByPk(req.params.id)
    if (!experience) return next(new ErrorResponse('Tajriba topilmadi', 404))
    await experience.update(req.body)
    res.status(200).json({ success: true, data: experience })
})

exports.deleteExperience = asyncHandler(async (req, res, next) => {
    const experience = await Experience.findByPk(req.params.id)
    if (!experience) return next(new ErrorResponse('Tajriba topilmadi', 404))
    if (experience.companyLogo?.publicId) await deleteFromCloudinary(experience.companyLogo.publicId)
    await experience.destroy()
    res.status(200).json({ success: true, message: "Tajriba o'chirildi", data: {} })
})

// === LOGO YUKLASH ===
exports.uploadLogo = asyncHandler(async (req, res, next) => {
    const experience = await Experience.findByPk(req.params.id)
    if (!experience) return next(new ErrorResponse('Tajriba topilmadi', 404))
    if (!req.file) return next(new ErrorResponse('Logo tanlang', 400))

    if (experience.companyLogo?.publicId) await deleteFromCloudinary(experience.companyLogo.publicId)
    const result = await uploadToCloudinary(req.file.buffer, 'experience', {
        transformation: [{ width: 200, height: 200, crop: 'fit', quality: 'auto' }],
    })
    await experience.update({ companyLogo: result })
    res.status(200).json({ success: true, data: experience })
})

exports.deleteLogo = asyncHandler(async (req, res, next) => {
    const experience = await Experience.findByPk(req.params.id)
    if (!experience) return next(new ErrorResponse('Tajriba topilmadi', 404))
    if (experience.companyLogo?.publicId) await deleteFromCloudinary(experience.companyLogo.publicId)
    await experience.update({ companyLogo: null })
    res.status(200).json({ success: true, message: "Logo o'chirildi", data: experience })
})
