const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const ApiFeatures = require('../utils/apiFeatures')
const { Faq, Category } = require('../models')

exports.getFaqs = asyncHandler(async (req, res, next) => {
    const features = new ApiFeatures(Faq, req.query)
        .filter()
        .search(['question', 'answer'])
        .sort()
        .select()
        .include([{ model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] }])

    const { data, pagination } = await features.paginate()
    res.status(200).json({ success: true, count: data.length, pagination, data })
})

exports.getFaq = asyncHandler(async (req, res, next) => {
    const item = await Faq.findByPk(req.params.id, {
        include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] }],
    })
    if (!item) return next(new ErrorResponse('Savol topilmadi', 404))
    res.status(200).json({ success: true, data: item })
})

exports.createFaq = asyncHandler(async (req, res, next) => {
    const item = await Faq.create(req.body)
    res.status(201).json({ success: true, data: item })
})

exports.updateFaq = asyncHandler(async (req, res, next) => {
    const item = await Faq.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Savol topilmadi', 404))
    await item.update(req.body)
    res.status(200).json({ success: true, data: item })
})

exports.deleteFaq = asyncHandler(async (req, res, next) => {
    const item = await Faq.findByPk(req.params.id)
    if (!item) return next(new ErrorResponse('Savol topilmadi', 404))
    await item.destroy()
    res.status(200).json({ success: true, message: "Savol o'chirildi", data: {} })
})
