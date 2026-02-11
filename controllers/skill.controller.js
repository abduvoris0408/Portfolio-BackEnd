const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const ApiFeatures = require('../utils/apiFeatures')
const { Skill, Category } = require('../models')
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary.config')

exports.getSkills = asyncHandler(async (req, res, next) => {
	const features = new ApiFeatures(Skill, req.query)
		.filter()
		.search(['name'])
		.sort()
		.select()
		.include([{ model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] }])

	const { data, pagination } = await features.paginate()
	res.status(200).json({ success: true, count: data.length, pagination, data })
})

exports.getSkill = asyncHandler(async (req, res, next) => {
	const skill = await Skill.findByPk(req.params.id, {
		include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] }],
	})
	if (!skill) return next(new ErrorResponse('Soha topilmadi', 404))
	res.status(200).json({ success: true, data: skill })
})

exports.createSkill = asyncHandler(async (req, res, next) => {
	const skill = await Skill.create(req.body)
	res.status(201).json({ success: true, data: skill })
})

exports.updateSkill = asyncHandler(async (req, res, next) => {
	const skill = await Skill.findByPk(req.params.id)
	if (!skill) return next(new ErrorResponse('Soha topilmadi', 404))
	await skill.update(req.body)
	res.status(200).json({ success: true, data: skill })
})

exports.deleteSkill = asyncHandler(async (req, res, next) => {
	const skill = await Skill.findByPk(req.params.id)
	if (!skill) return next(new ErrorResponse('Soha topilmadi', 404))
	if (skill.image?.publicId) await deleteFromCloudinary(skill.image.publicId)
	await skill.destroy()
	res.status(200).json({ success: true, message: "Soha o'chirildi", data: {} })
})

// === RASM YUKLASH ===
exports.uploadImage = asyncHandler(async (req, res, next) => {
	const skill = await Skill.findByPk(req.params.id)
	if (!skill) return next(new ErrorResponse('Soha topilmadi', 404))
	if (!req.file) return next(new ErrorResponse('Rasm tanlang', 400))

	if (skill.image?.publicId) await deleteFromCloudinary(skill.image.publicId)
	const result = await uploadToCloudinary(req.file.buffer, 'skills', {
		transformation: [{ width: 200, height: 200, crop: 'fit', quality: 'auto' }],
	})
	await skill.update({ image: result })
	res.status(200).json({ success: true, data: skill })
})

exports.deleteImage = asyncHandler(async (req, res, next) => {
	const skill = await Skill.findByPk(req.params.id)
	if (!skill) return next(new ErrorResponse('Soha topilmadi', 404))
	if (skill.image?.publicId) await deleteFromCloudinary(skill.image.publicId)

	skill.image = null
	skill.changed('image', true)
	await skill.save()
	await skill.reload()

	res.status(200).json({ success: true, message: "Rasm o'chirildi", data: skill })
})
