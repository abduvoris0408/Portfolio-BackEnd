const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const ApiFeatures = require('../utils/apiFeatures')
const { Consultation, Service } = require('../models')

// === PUBLIC ===
exports.createConsultation = asyncHandler(async (req, res, next) => {
    req.body.ipAddress = req.ip || req.connection.remoteAddress
    const item = await Consultation.create(req.body)
    res.status(201).json({ success: true, message: "Maslahat so'rovingiz yuborildi!", data: item })
})

// === ADMIN ===
exports.getConsultations = asyncHandler(async (req, res, next) => {
    const features = new ApiFeatures(Consultation, req.query)
        .filter()
        .search(['fullName', 'phone', 'email', 'message'])
        .sort()
        .select()
        .include([{ model: Service, as: 'service', attributes: ['id', 'title', 'slug'] }])

    const { data, pagination } = await features.paginate()
    res.status(200).json({ success: true, count: data.length, pagination, data })
})

exports.getConsultation = asyncHandler(async (req, res, next) => {
    const item = await Consultation.findByPk(req.params.id, {
        include: [{ model: Service, as: 'service', attributes: ['id', 'title', 'slug'] }],
    })
    if (!item) return next(new ErrorResponse("So'rov topilmadi", 404))
    res.status(200).json({ success: true, data: item })
})

exports.updateConsultationStatus = asyncHandler(async (req, res, next) => {
    const item = await Consultation.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse("So'rov topilmadi", 404))
    const { status, adminNotes } = req.body
    const updateData = {}
    if (status) updateData.status = status
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes
    await item.update(updateData)
    res.status(200).json({ success: true, data: item })
})

exports.deleteConsultation = asyncHandler(async (req, res, next) => {
    const item = await Consultation.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse("So'rov topilmadi", 404))
    await item.destroy()
    res.status(200).json({ success: true, message: "So'rov o'chirildi", data: {} })
})
