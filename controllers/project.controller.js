const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const ApiFeatures = require('../utils/apiFeatures')
const { Project, Category } = require('../models')
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary.config')

exports.getProjects = asyncHandler(async (req, res, next) => {
	const features = new ApiFeatures(Project, req.query)
		.filter()
		.search(['title', 'description'])
		.sort()
		.select()
		.include([{ model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] }])

	const { data, pagination } = await features.paginate()
	res.status(200).json({ success: true, count: data.length, pagination, data })
})

exports.getProject = asyncHandler(async (req, res, next) => {
	const project = await Project.findByPk(req.params.id, {
		include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] }],
	})
	if (!project) return next(new ErrorResponse('Loyiha topilmadi', 404))
	await project.increment('views')
	res.status(200).json({ success: true, data: project })
})

exports.createProject = asyncHandler(async (req, res, next) => {
	const project = await Project.create(req.body)
	res.status(201).json({ success: true, data: project })
})

exports.updateProject = asyncHandler(async (req, res, next) => {
	const project = await Project.findByPk(req.params.id)
	if (!project) return next(new ErrorResponse('Loyiha topilmadi', 404))
	await project.update(req.body)
	res.status(200).json({ success: true, data: project })
})

exports.deleteProject = asyncHandler(async (req, res, next) => {
	const project = await Project.findByPk(req.params.id)
	if (!project) return next(new ErrorResponse('Loyiha topilmadi', 404))
	// Rasmlarni o'chirish
	if (project.image?.publicId) await deleteFromCloudinary(project.image.publicId)
	if (project.gallery?.length) {
		for (const img of project.gallery) {
			if (img.publicId) await deleteFromCloudinary(img.publicId)
		}
	}
	await project.destroy()
	res.status(200).json({ success: true, message: "Loyiha o'chirildi", data: {} })
})

// === RASM YUKlASH ===
exports.uploadImage = asyncHandler(async (req, res, next) => {
	const project = await Project.findByPk(req.params.id)
	if (!project) return next(new ErrorResponse('Loyiha topilmadi', 404))
	if (!req.file) return next(new ErrorResponse('Rasm tanlang', 400))

	if (project.image?.publicId) await deleteFromCloudinary(project.image.publicId)
	const result = await uploadToCloudinary(req.file.buffer, 'projects', {
		transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
	})
	await project.update({ image: result })
	res.status(200).json({ success: true, data: project })
})

exports.deleteImage = asyncHandler(async (req, res, next) => {
	const project = await Project.findByPk(req.params.id)
	if (!project) return next(new ErrorResponse('Loyiha topilmadi', 404))
	if (project.image?.publicId) await deleteFromCloudinary(project.image.publicId)
	await project.update({ image: null })
	res.status(200).json({ success: true, message: "Rasm o'chirildi", data: project })
})

// Galereya rasm qo'shish
exports.addGalleryImage = asyncHandler(async (req, res, next) => {
	const project = await Project.findByPk(req.params.id)
	if (!project) return next(new ErrorResponse('Loyiha topilmadi', 404))
	if (!req.file) return next(new ErrorResponse('Rasm tanlang', 400))

	const result = await uploadToCloudinary(req.file.buffer, 'projects/gallery', {
		transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
	})
	const gallery = [...(project.gallery || []), result]
	await project.update({ gallery })
	res.status(200).json({ success: true, data: project })
})

// Galereya rasm o'chirish (index bo'yicha)
exports.deleteGalleryImage = asyncHandler(async (req, res, next) => {
	const project = await Project.findByPk(req.params.id)
	if (!project) return next(new ErrorResponse('Loyiha topilmadi', 404))
	const index = parseInt(req.params.index)
	const gallery = project.gallery || []
	if (index < 0 || index >= gallery.length) return next(new ErrorResponse('Rasm topilmadi', 404))

	if (gallery[index].publicId) await deleteFromCloudinary(gallery[index].publicId)
	gallery.splice(index, 1)
	await project.update({ gallery })
	res.status(200).json({ success: true, message: "Rasm o'chirildi", data: project })
})
