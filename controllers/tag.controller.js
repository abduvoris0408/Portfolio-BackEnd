const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const ApiFeatures = require('../utils/apiFeatures')
const { Tag } = require('../models')

exports.getTags = asyncHandler(async (req, res, next) => {
    const features = new ApiFeatures(Tag, req.query)
        .filter()
        .search(['name'])
        .sort()
        .select()

    const { data, pagination } = await features.paginate()
    res.status(200).json({ success: true, count: data.length, pagination, data })
})

exports.getTag = asyncHandler(async (req, res, next) => {
    const tag = await Tag.findByPk(req.params.id)
    if (!tag) return next(new ErrorResponse(`Teg topilmadi: ${req.params.id}`, 404))
    res.status(200).json({ success: true, data: tag })
})

exports.createTag = asyncHandler(async (req, res, next) => {
    const tag = await Tag.create(req.body)
    res.status(201).json({ success: true, data: tag })
})

exports.updateTag = asyncHandler(async (req, res, next) => {
    const tag = await Tag.findByPk(req.params.id)
    if (!tag) return next(new ErrorResponse(`Teg topilmadi: ${req.params.id}`, 404))
    await tag.update(req.body)
    res.status(200).json({ success: true, data: tag })
})

exports.deleteTag = asyncHandler(async (req, res, next) => {
    const tag = await Tag.findByPk(req.params.id)
    if (!tag) return next(new ErrorResponse(`Teg topilmadi: ${req.params.id}`, 404))
    await tag.destroy()
    res.status(200).json({ success: true, message: "Teg o'chirildi", data: {} })
})
