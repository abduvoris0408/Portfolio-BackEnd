const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const ApiFeatures = require('../utils/apiFeatures')
const { Achievement } = require('../models')
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary.config')

exports.getAchievements = asyncHandler(async (req, res, next) => {
    const features = new ApiFeatures(Achievement, req.query)
        .filter()
        .search(['title', 'issuer', 'description'])
        .sort()
        .select()

    const { data, pagination } = await features.paginate()
    res.status(200).json({ success: true, count: data.length, pagination, data })
})

exports.getAchievement = asyncHandler(async (req, res, next) => {
    const item = await Achievement.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Yutuq topilmadi', 404))
    res.status(200).json({ success: true, data: item })
})

exports.createAchievement = asyncHandler(async (req, res, next) => {
    const item = await Achievement.create(req.body)
    res.status(201).json({ success: true, data: item })
})

exports.updateAchievement = asyncHandler(async (req, res, next) => {
    const item = await Achievement.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Yutuq topilmadi', 404))
    await item.update(req.body)
    res.status(200).json({ success: true, data: item })
})

exports.deleteAchievement = asyncHandler(async (req, res, next) => {
    const item = await Achievement.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Yutuq topilmadi', 404))
    if (item.image?.publicId) await deleteFromCloudinary(item.image.publicId)
    await item.destroy()
    res.status(200).json({ success: true, message: "Yutuq o'chirildi", data: {} })
})

// Sertifikat rasmi yuklash
exports.uploadImage = asyncHandler(async (req, res, next) => {
    const item = await Achievement.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Yutuq topilmadi', 404))
    if (!req.file) return next(new ErrorResponse('Rasm tanlang', 400))

    if (item.image?.publicId) await deleteFromCloudinary(item.image.publicId)

    const result = await uploadToCloudinary(req.file.buffer, 'achievements', {
        transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }],
    })
    await item.update({ image: result })
    res.status(200).json({ success: true, data: item })
})

exports.deleteImage = asyncHandler(async (req, res, next) => {
    const item = await Achievement.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Yutuq topilmadi', 404))
    if (item.image?.publicId) await deleteFromCloudinary(item.image.publicId)
    await item.update({ image: null })
    res.status(200).json({ success: true, message: "Rasm o'chirildi", data: item })
})
