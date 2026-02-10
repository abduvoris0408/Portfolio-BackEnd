const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const ApiFeatures = require('../utils/apiFeatures')
const { Service, ServiceDetail, Category } = require('../models')
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary.config')

// ============ SERVICE ============

exports.getServices = asyncHandler(async (req, res, next) => {
    const features = new ApiFeatures(Service, req.query)
        .filter()
        .search(['title', 'description'])
        .sort()
        .select()
        .include([{ model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] }])

    const { data, pagination } = await features.paginate()
    res.status(200).json({ success: true, count: data.length, pagination, data })
})

exports.getService = asyncHandler(async (req, res, next) => {
    const service = await Service.findByPk(req.params.id, {
        include: [
            { model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] },
            { model: ServiceDetail, as: 'details', order: [['order', 'ASC']] },
        ],
    })
    if (!service) return next(new ErrorResponse('Xizmat topilmadi', 404))
    res.status(200).json({ success: true, data: service })
})

exports.createService = asyncHandler(async (req, res, next) => {
    const service = await Service.create(req.body)
    res.status(201).json({ success: true, data: service })
})

exports.updateService = asyncHandler(async (req, res, next) => {
    const service = await Service.findByPk(req.params.id)
    if (!service) return next(new ErrorResponse('Xizmat topilmadi', 404))
    await service.update(req.body)
    res.status(200).json({ success: true, data: service })
})

exports.deleteService = asyncHandler(async (req, res, next) => {
    const service = await Service.findByPk(req.params.id)
    if (!service) return next(new ErrorResponse('Xizmat topilmadi', 404))
    if (service.image?.publicId) await deleteFromCloudinary(service.image.publicId)
    await ServiceDetail.destroy({ where: { serviceId: service.id } })
    await service.destroy()
    res.status(200).json({ success: true, message: "Xizmat o'chirildi", data: {} })
})

// === RASM YUKLASH ===
exports.uploadImage = asyncHandler(async (req, res, next) => {
    const service = await Service.findByPk(req.params.id)
    if (!service) return next(new ErrorResponse('Xizmat topilmadi', 404))
    if (!req.file) return next(new ErrorResponse('Rasm tanlang', 400))

    if (service.image?.publicId) await deleteFromCloudinary(service.image.publicId)
    const result = await uploadToCloudinary(req.file.buffer, 'services', {
        transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }],
    })
    await service.update({ image: result })
    res.status(200).json({ success: true, data: service })
})

exports.deleteImage = asyncHandler(async (req, res, next) => {
    const service = await Service.findByPk(req.params.id)
    if (!service) return next(new ErrorResponse('Xizmat topilmadi', 404))
    if (service.image?.publicId) await deleteFromCloudinary(service.image.publicId)
    await service.update({ image: null })
    res.status(200).json({ success: true, message: "Rasm o'chirildi", data: service })
})

// ============ SERVICE DETAIL ============

exports.getServiceDetails = asyncHandler(async (req, res, next) => {
    const features = new ApiFeatures(ServiceDetail, req.query)
        .filter()
        .search(['title', 'description'])
        .sort()
        .select()
        .include([{ model: Service, as: 'service', attributes: ['id', 'title', 'slug'] }])

    const { data, pagination } = await features.paginate()
    res.status(200).json({ success: true, count: data.length, pagination, data })
})

exports.getServiceDetail = asyncHandler(async (req, res, next) => {
    const detail = await ServiceDetail.findByPk(req.params.id, {
        include: [{ model: Service, as: 'service', attributes: ['id', 'title', 'slug'] }],
    })
    if (!detail) return next(new ErrorResponse('Tafsilot topilmadi', 404))
    res.status(200).json({ success: true, data: detail })
})

exports.createServiceDetail = asyncHandler(async (req, res, next) => {
    const service = await Service.findByPk(req.body.serviceId || req.body.service_id)
    if (!service) return next(new ErrorResponse('Xizmat topilmadi', 404))
    const detail = await ServiceDetail.create(req.body)
    res.status(201).json({ success: true, data: detail })
})

exports.updateServiceDetail = asyncHandler(async (req, res, next) => {
    const detail = await ServiceDetail.findByPk(req.params.id)
    if (!detail) return next(new ErrorResponse('Tafsilot topilmadi', 404))
    await detail.update(req.body)
    res.status(200).json({ success: true, data: detail })
})

exports.deleteServiceDetail = asyncHandler(async (req, res, next) => {
    const detail = await ServiceDetail.findByPk(req.params.id)
    if (!detail) return next(new ErrorResponse('Tafsilot topilmadi', 404))
    await detail.destroy()
    res.status(200).json({ success: true, message: "Tafsilot o'chirildi", data: {} })
})
