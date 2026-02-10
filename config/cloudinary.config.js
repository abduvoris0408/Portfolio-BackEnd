const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

// Cloudinary sozlamalari
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ===== STORAGE CONFIGS =====

// Avatar uchun
const avatarStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'portfolio/avatars',
		allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
		transformation: [
			{ width: 500, height: 500, crop: 'fill', gravity: 'face', quality: 'auto' },
		],
	},
})

// Cover image uchun
const coverStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'portfolio/covers',
		allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
		transformation: [
			{ width: 1920, height: 1080, crop: 'limit', quality: 'auto' },
		],
	},
})

// Project rasmlari uchun
const projectStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'portfolio/projects',
		allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
		transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
	},
})

// Blog rasmlari uchun
const blogStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'portfolio/blog',
		allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
		transformation: [{ width: 1200, height: 630, crop: 'limit', quality: 'auto' }],
	},
})

// Resume / hujjatlar uchun
const documentStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'portfolio/documents',
		allowed_formats: ['pdf', 'doc', 'docx'],
		resource_type: 'raw',
	},
})

// Universal rasm storage
const generalStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'portfolio/general',
		allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
		transformation: [{ quality: 'auto' }],
	},
})

// ===== MULTER MIDDLEWARE =====

const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image/')) {
		cb(null, true)
	} else {
		cb(new Error('Faqat rasm fayllarini yuklash mumkin!'), false)
	}
}

const documentFilter = (req, file, cb) => {
	const allowedMimes = [
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	]
	if (allowedMimes.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(new Error('Faqat PDF, DOC, DOCX fayllarini yuklash mumkin!'), false)
	}
}

const uploadAvatar = multer({
	storage: avatarStorage,
	limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
	fileFilter,
})

const uploadCover = multer({
	storage: coverStorage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
	fileFilter,
})

const uploadProject = multer({
	storage: projectStorage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
	fileFilter,
})

const uploadBlog = multer({
	storage: blogStorage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter,
})

const uploadDocument = multer({
	storage: documentStorage,
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
	fileFilter: documentFilter,
})

const uploadGeneral = multer({
	storage: generalStorage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter,
})

// About sahifasi uchun bir nechta fayl yuklash
const uploadAboutFiles = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
	fileFilter: (req, file, cb) => {
		const allowedMimes = [
			'image/jpeg',
			'image/png',
			'image/webp',
			'image/gif',
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		]
		if (allowedMimes.includes(file.mimetype)) {
			cb(null, true)
		} else {
			cb(new Error("Ruxsat etilmagan fayl turi!"), false)
		}
	},
})

// ===== HELPER FUNCTIONS =====

// Rasmni buffer'dan Cloudinary'ga yuklash
const uploadToCloudinary = async (fileBuffer, folder, options = {}) => {
	return new Promise((resolve, reject) => {
		const uploadOptions = {
			folder: `portfolio/${folder}`,
			...options,
		}

		const uploadStream = cloudinary.uploader.upload_stream(
			uploadOptions,
			(error, result) => {
				if (error) return reject(error)
				resolve({
					url: result.secure_url,
					publicId: result.public_id,
				})
			},
		)

		uploadStream.end(fileBuffer)
	})
}

// Rasmni o'chirish
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
	try {
		if (!publicId) return { success: true }
		const result = await cloudinary.uploader.destroy(publicId, {
			resource_type: resourceType,
		})
		return { success: true, result }
	} catch (error) {
		return { success: false, error: error.message }
	}
}

module.exports = {
	cloudinary,
	uploadAvatar,
	uploadCover,
	uploadProject,
	uploadBlog,
	uploadDocument,
	uploadGeneral,
	uploadAboutFiles,
	uploadToCloudinary,
	deleteFromCloudinary,
}
