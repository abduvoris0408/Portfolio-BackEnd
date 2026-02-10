const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const ApiFeatures = require('../utils/apiFeatures')
const { Contact } = require('../models')

// @desc    Public – junatish
exports.createContact = asyncHandler(async (req, res, next) => {
    req.body.ipAddress = req.ip || req.connection.remoteAddress
    const contact = await Contact.create(req.body)
    res.status(201).json({ success: true, message: "Xabaringiz yuborildi!", data: contact })
})

// @desc    Admin – ro'yxat
exports.getContacts = asyncHandler(async (req, res, next) => {
    const features = new ApiFeatures(Contact, req.query)
        .filter()
        .search(['name', 'email', 'subject', 'message'])
        .sort()
        .select()

    const { data, pagination } = await features.paginate()
    res.status(200).json({ success: true, count: data.length, pagination, data })
})

// @desc    Admin – bitta
exports.getContact = asyncHandler(async (req, res, next) => {
    const contact = await Contact.findByPk(req.params.id)
    if (!contact) return next(new ErrorResponse(`Xabar topilmadi: ${req.params.id}`, 404))
    res.status(200).json({ success: true, data: contact })
})

// @desc    Admin – o'qilganlik
exports.markAsRead = asyncHandler(async (req, res, next) => {
    const contact = await Contact.findByPk(req.params.id)
    if (!contact) return next(new ErrorResponse(`Xabar topilmadi: ${req.params.id}`, 404))
    await contact.update({ isRead: true })
    res.status(200).json({ success: true, message: "O'qildi deb belgilandi", data: contact })
})

// @desc    Admin – javob berilganlik
exports.markAsReplied = asyncHandler(async (req, res, next) => {
    const contact = await Contact.findByPk(req.params.id)
    if (!contact) return next(new ErrorResponse(`Xabar topilmadi: ${req.params.id}`, 404))
    await contact.update({ isReplied: true, repliedAt: new Date() })
    res.status(200).json({ success: true, message: "Javob berildi deb belgilandi", data: contact })
})

// @desc    Admin – o'chirish
exports.deleteContact = asyncHandler(async (req, res, next) => {
    const contact = await Contact.findByPk(req.params.id)
    if (!contact) return next(new ErrorResponse(`Xabar topilmadi: ${req.params.id}`, 404))
    await contact.destroy()
    res.status(200).json({ success: true, message: "Xabar o'chirildi", data: {} })
})
