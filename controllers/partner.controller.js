const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const ApiFeatures = require('../utils/apiFeatures')
const { Partner } = require('../models')
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary.config')

exports.getPartners = asyncHandler(async (req, res, next) => {
    const features = new ApiFeatures(Partner, req.query)
        .filter()
        .search(['name'])
        .sort()
        .select()

    const { data, pagination } = await features.paginate()
    res.status(200).json({ success: true, count: data.length, pagination, data })
})

exports.getPartner = asyncHandler(async (req, res, next) => {
    const item = await Partner.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Hamkor topilmadi', 404))
    res.status(200).json({ success: true, data: item })
})

exports.createPartner = asyncHandler(async (req, res, next) => {
    const item = await Partner.create(req.body)
    res.status(201).json({ success: true, data: item })
})

exports.updatePartner = asyncHandler(async (req, res, next) => {
    const item = await Partner.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Hamkor topilmadi', 404))
    await item.update(req.body)
    res.status(200).json({ success: true, data: item })
})

exports.deletePartner = asyncHandler(async (req, res, next) => {
    const item = await Partner.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Hamkor topilmadi', 404))
    if (item.logo?.publicId) await deleteFromCloudinary(item.logo.publicId)
    await item.destroy()
    res.status(200).json({ success: true, message: "Hamkor o'chirildi", data: {} })
})

// Logo yuklash
exports.uploadLogo = asyncHandler(async (req, res, next) => {
    const item = await Partner.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Hamkor topilmadi', 404))
    if (!req.file) return next(new ErrorResponse('Logo tanlang', 400))

    if (item.logo?.publicId) await deleteFromCloudinary(item.logo.publicId)

    const result = await uploadToCloudinary(req.file.buffer, 'partners', {
        transformation: [{ width: 300, height: 150, crop: 'fit', quality: 'auto' }],
    })
    await item.update({ logo: result })
    res.status(200).json({ success: true, data: item })
})

exports.deleteLogo = asyncHandler(async (req, res, next) => {
    const item = await Partner.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Hamkor topilmadi', 404))
    if (item.logo?.publicId) await deleteFromCloudinary(item.logo.publicId)
    await item.update({ logo: null })
    res.status(200).json({ success: true, message: "Logo o'chirildi", data: item })
})
