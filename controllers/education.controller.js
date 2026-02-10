const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const ApiFeatures = require('../utils/apiFeatures')
const { Education } = require('../models')
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary.config')

exports.getEducation = asyncHandler(async (req, res, next) => {
    const features = new ApiFeatures(Education, req.query)
        .filter()
        .search(['school', 'degree', 'fieldOfStudy'])
        .sort()
        .select()

    const { data, pagination } = await features.paginate()
    res.status(200).json({ success: true, count: data.length, pagination, data })
})

exports.getEducationItem = asyncHandler(async (req, res, next) => {
    const education = await Education.findByPk(req.params.id)
    if (!education) return next(new ErrorResponse("Ta'lim topilmadi", 404))
    res.status(200).json({ success: true, data: education })
})

exports.createEducation = asyncHandler(async (req, res, next) => {
    const education = await Education.create(req.body)
    res.status(201).json({ success: true, data: education })
})

exports.updateEducation = asyncHandler(async (req, res, next) => {
    const education = await Education.findByPk(req.params.id)
    if (!education) return next(new ErrorResponse("Ta'lim topilmadi", 404))
    await education.update(req.body)
    res.status(200).json({ success: true, data: education })
})

exports.deleteEducation = asyncHandler(async (req, res, next) => {
    const education = await Education.findByPk(req.params.id)
    if (!education) return next(new ErrorResponse("Ta'lim topilmadi", 404))
    if (education.schoolLogo?.publicId) await deleteFromCloudinary(education.schoolLogo.publicId)
    await education.destroy()
    res.status(200).json({ success: true, message: "Ta'lim o'chirildi", data: {} })
})

// === LOGO YUKLASH ===
exports.uploadLogo = asyncHandler(async (req, res, next) => {
    const education = await Education.findByPk(req.params.id)
    if (!education) return next(new ErrorResponse("Ta'lim topilmadi", 404))
    if (!req.file) return next(new ErrorResponse('Logo tanlang', 400))

    if (education.schoolLogo?.publicId) await deleteFromCloudinary(education.schoolLogo.publicId)
    const result = await uploadToCloudinary(req.file.buffer, 'education', {
        transformation: [{ width: 200, height: 200, crop: 'fit', quality: 'auto' }],
    })
    await education.update({ schoolLogo: result })
    res.status(200).json({ success: true, data: education })
})

exports.deleteLogo = asyncHandler(async (req, res, next) => {
    const education = await Education.findByPk(req.params.id)
    if (!education) return next(new ErrorResponse("Ta'lim topilmadi", 404))
    if (education.schoolLogo?.publicId) await deleteFromCloudinary(education.schoolLogo.publicId)
    await education.update({ schoolLogo: null })
    res.status(200).json({ success: true, message: "Logo o'chirildi", data: education })
})
