const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const ApiFeatures = require('../utils/apiFeatures')
const { Category } = require('../models')
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary.config')

exports.getCategories = asyncHandler(async (req, res, next) => {
	const features = new ApiFeatures(Category, req.query)
		.filter()
		.search(['name', 'description'])
		.sort()
		.select()

	const { data, pagination } = await features.paginate()
	res.status(200).json({ success: true, count: data.length, pagination, data })
})

exports.getCategory = asyncHandler(async (req, res, next) => {
	const category = await Category.findByPk(req.params.id)
	if (!category) return next(new ErrorResponse('Kategoriya topilmadi', 404))
	res.status(200).json({ success: true, data: category })
})

exports.createCategory = asyncHandler(async (req, res, next) => {
	const category = await Category.create(req.body)
	res.status(201).json({ success: true, data: category })
})

exports.updateCategory = asyncHandler(async (req, res, next) => {
	const category = await Category.findByPk(req.params.id)
	if (!category) return next(new ErrorResponse('Kategoriya topilmadi', 404))
	await category.update(req.body)
	res.status(200).json({ success: true, data: category })
})

exports.deleteCategory = asyncHandler(async (req, res, next) => {
	const category = await Category.findByPk(req.params.id)
	if (!category) return next(new ErrorResponse('Kategoriya topilmadi', 404))
	if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId)
	await category.destroy()
	res.status(200).json({ success: true, message: "Kategoriya o'chirildi", data: {} })
})

// === RASM YUKLASH ===
exports.uploadImage = asyncHandler(async (req, res, next) => {
	const category = await Category.findByPk(req.params.id)
	if (!category) return next(new ErrorResponse('Kategoriya topilmadi', 404))
	if (!req.file) return next(new ErrorResponse('Rasm tanlang', 400))

	if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId)
	const result = await uploadToCloudinary(req.file.buffer, 'categories', {
		transformation: [{ width: 400, height: 400, crop: 'fit', quality: 'auto' }],
	})
	await category.update({ image: result })
	res.status(200).json({ success: true, data: category })
})

exports.deleteImage = asyncHandler(async (req, res, next) => {
	const category = await Category.findByPk(req.params.id)
	if (!category) return next(new ErrorResponse('Kategoriya topilmadi', 404))
	if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId)

	category.image = null
	category.changed('image', true)
	await category.save()
	await category.reload()

	res.status(200).json({ success: true, message: "Rasm o'chirildi", data: category })
})
