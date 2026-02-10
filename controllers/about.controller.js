const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const { About } = require('../models')
const {
	uploadToCloudinary,
	deleteFromCloudinary,
} = require('../config/cloudinary.config')

// @desc    Get about info (public)
exports.getAbout = asyncHandler(async (req, res, next) => {
	const about = await About.findOne({ where: { isActive: true } })

	if (!about) {
		return res.status(200).json({ success: true, data: null, message: "Ma'lumot hali kiritilmagan" })
	}

	const data = about.toJSON()
	data.age = about.getAge()

	res.status(200).json({ success: true, data })
})

// @desc    Get about info (admin)
exports.getAboutAdmin = asyncHandler(async (req, res, next) => {
	const about = await About.findOne()

	if (!about) {
		return res.status(200).json({ success: true, data: null, message: "Ma'lumot hali kiritilmagan" })
	}

	const data = about.toJSON()
	data.age = about.getAge()

	res.status(200).json({ success: true, data })
})

// @desc    Create or Update about
exports.createOrUpdateAbout = asyncHandler(async (req, res, next) => {
	let about = await About.findOne()

	if (about) {
		await about.update(req.body)
		const data = about.toJSON()
		data.age = about.getAge()
		return res.status(200).json({ success: true, message: "Ma'lumot yangilandi", data })
	}

	about = await About.create(req.body)
	const data = about.toJSON()
	data.age = about.getAge()

	res.status(201).json({ success: true, message: "Ma'lumot yaratildi", data })
})

// @desc    Upload avatar
exports.uploadAvatar = asyncHandler(async (req, res, next) => {
	if (!req.file) return next(new ErrorResponse('Rasm fayli yuklang', 400))

	let about = await About.findOne()
	if (!about) return next(new ErrorResponse("Avval about ma'lumotlarini yarating", 404))

	if (about.avatar && about.avatar.publicId) {
		await deleteFromCloudinary(about.avatar.publicId)
	}

	const result = await uploadToCloudinary(req.file.buffer, 'avatars', {
		transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'face', quality: 'auto' }],
	})

	await about.update({ avatar: result })

	res.status(200).json({ success: true, message: 'Avatar yuklandi', data: { avatar: about.avatar } })
})

// @desc    Upload cover image
exports.uploadCover = asyncHandler(async (req, res, next) => {
	if (!req.file) return next(new ErrorResponse('Rasm fayli yuklang', 400))

	let about = await About.findOne()
	if (!about) return next(new ErrorResponse("Avval about ma'lumotlarini yarating", 404))

	if (about.coverImage && about.coverImage.publicId) {
		await deleteFromCloudinary(about.coverImage.publicId)
	}

	const result = await uploadToCloudinary(req.file.buffer, 'covers', {
		transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto' }],
	})

	await about.update({ coverImage: result })

	res.status(200).json({ success: true, message: 'Cover yuklandi', data: { coverImage: about.coverImage } })
})

// @desc    Upload resume
exports.uploadResume = asyncHandler(async (req, res, next) => {
	if (!req.file) return next(new ErrorResponse('Resume fayli yuklang', 400))

	let about = await About.findOne()
	if (!about) return next(new ErrorResponse("Avval about ma'lumotlarini yarating", 404))

	if (about.resume && about.resume.publicId) {
		await deleteFromCloudinary(about.resume.publicId, 'raw')
	}

	const result = await uploadToCloudinary(req.file.buffer, 'documents', { resource_type: 'raw' })

	await about.update({ resume: result })

	res.status(200).json({ success: true, message: 'Resume yuklandi', data: { resume: about.resume } })
})

// @desc    Delete avatar
exports.deleteAvatar = asyncHandler(async (req, res, next) => {
	const about = await About.findOne()
	if (!about) return next(new ErrorResponse("Ma'lumot topilmadi", 404))

	if (about.avatar && about.avatar.publicId) await deleteFromCloudinary(about.avatar.publicId)
	await about.update({ avatar: { url: '', publicId: '' } })

	res.status(200).json({ success: true, message: "Avatar o'chirildi", data: {} })
})

// @desc    Delete cover
exports.deleteCover = asyncHandler(async (req, res, next) => {
	const about = await About.findOne()
	if (!about) return next(new ErrorResponse("Ma'lumot topilmadi", 404))

	if (about.coverImage && about.coverImage.publicId) await deleteFromCloudinary(about.coverImage.publicId)
	await about.update({ coverImage: { url: '', publicId: '' } })

	res.status(200).json({ success: true, message: "Cover o'chirildi", data: {} })
})

// @desc    Delete resume
exports.deleteResume = asyncHandler(async (req, res, next) => {
	const about = await About.findOne()
	if (!about) return next(new ErrorResponse("Ma'lumot topilmadi", 404))

	if (about.resume && about.resume.publicId) await deleteFromCloudinary(about.resume.publicId, 'raw')
	await about.update({ resume: { url: '', publicId: '' } })

	res.status(200).json({ success: true, message: "Resume o'chirildi", data: {} })
})

// @desc    Update section (PATCH)
exports.updateSection = asyncHandler(async (req, res, next) => {
	const allowedSections = ['stats', 'socialLinks', 'languages', 'interests', 'whatIDo', 'seo', 'location', 'typingTexts']
	const { section } = req.params

	if (!allowedSections.includes(section)) {
		return next(new ErrorResponse(`"${section}" bo'limi mavjud emas. Ruxsat etilganlar: ${allowedSections.join(', ')}`, 400))
	}

	let about = await About.findOne()
	if (!about) return next(new ErrorResponse("Avval about ma'lumotlarini yarating", 404))

	await about.update({ [section]: req.body[section] || req.body })

	res.status(200).json({ success: true, message: `"${section}" yangilandi`, data: { [section]: about[section] } })
})

// @desc    Delete about
exports.deleteAbout = asyncHandler(async (req, res, next) => {
	const about = await About.findOne()
	if (!about) return next(new ErrorResponse("Ma'lumot topilmadi", 404))

	if (about.avatar && about.avatar.publicId) await deleteFromCloudinary(about.avatar.publicId)
	if (about.coverImage && about.coverImage.publicId) await deleteFromCloudinary(about.coverImage.publicId)
	if (about.resume && about.resume.publicId) await deleteFromCloudinary(about.resume.publicId, 'raw')

	await about.destroy()

	res.status(200).json({ success: true, message: "Ma'lumot o'chirildi", data: {} })
})
