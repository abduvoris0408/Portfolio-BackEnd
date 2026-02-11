const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const ApiFeatures = require('../utils/apiFeatures')
const { Testimonial } = require('../models')
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary.config')

exports.getTestimonials = asyncHandler(async (req, res, next) => {
    const features = new ApiFeatures(Testimonial, req.query)
        .filter()
        .search(['clientName', 'content', 'caseType'])
        .sort()
        .select()

    const { data, pagination } = await features.paginate()
    res.status(200).json({ success: true, count: data.length, pagination, data })
})

exports.getTestimonial = asyncHandler(async (req, res, next) => {
    const item = await Testimonial.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Fikr topilmadi', 404))
    res.status(200).json({ success: true, data: item })
})

exports.createTestimonial = asyncHandler(async (req, res, next) => {
    const item = await Testimonial.create(req.body)
    res.status(201).json({ success: true, data: item })
})

exports.updateTestimonial = asyncHandler(async (req, res, next) => {
    const item = await Testimonial.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Fikr topilmadi', 404))
    await item.update(req.body)
    res.status(200).json({ success: true, data: item })
})

exports.deleteTestimonial = asyncHandler(async (req, res, next) => {
    const item = await Testimonial.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Fikr topilmadi', 404))
    if (item.clientImage?.publicId) await deleteFromCloudinary(item.clientImage.publicId)
    await item.destroy()
    res.status(200).json({ success: true, message: "Fikr o'chirildi", data: {} })
})

// Mijoz rasmi yuklash
exports.uploadClientImage = asyncHandler(async (req, res, next) => {
    const item = await Testimonial.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Fikr topilmadi', 404))
    if (!req.file) return next(new ErrorResponse('Rasm tanlang', 400))

    // Avvalgisini o'chirish
    if (item.clientImage?.publicId) await deleteFromCloudinary(item.clientImage.publicId)

    const result = await uploadToCloudinary(req.file.buffer, 'testimonials', {
        transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face', quality: 'auto' }],
    })
    await item.update({ clientImage: result })
    res.status(200).json({ success: true, data: item })
})

exports.deleteClientImage = asyncHandler(async (req, res, next) => {
    const item = await Testimonial.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Fikr topilmadi', 404))
    if (item.clientImage?.publicId) await deleteFromCloudinary(item.clientImage.publicId)

    item.clientImage = null
    item.changed('clientImage', true)
    await item.save()
    await item.reload()

    res.status(200).json({ success: true, message: "Rasm o'chirildi", data: item })
})
