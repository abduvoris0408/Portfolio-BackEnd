const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

// Cloudinary sozlamalari
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Storage sozlamalari - Loyiha rasmlari uchun
const projectStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'portfolio/projects',
		allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
		transformation: [{ width: 1200, height: 800, crop: 'limit' }],
	},
})

// Storage sozlamalari - Avatar uchun
const avatarStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'portfolio/avatars',
		allowed_formats: ['jpg', 'jpeg', 'png'],
		transformation: [
			{ width: 500, height: 500, crop: 'fill', gravity: 'face' },
		],
	},
})

// Multer sozlamalari
const uploadProject = multer({
	storage: projectStorage,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith('image/')) {
			cb(null, true)
		} else {
			cb(new Error('Faqat rasm fayllarini yuklash mumkin!'), false)
		}
	},
})

const uploadAvatar = multer({
	storage: avatarStorage,
	limits: {
		fileSize: 2 * 1024 * 1024, // 2MB
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith('image/')) {
			cb(null, true)
		} else {
			cb(new Error('Faqat rasm fayllarini yuklash mumkin!'), false)
		}
	},
})

// Rasmni o'chirish funksiyasi
const deleteImage = async publicId => {
	try {
		await cloudinary.uploader.destroy(publicId)
		return { success: true }
	} catch (error) {
		return { success: false, error: error.message }
	}
}

module.exports = {
	cloudinary,
	uploadProject,
	uploadAvatar,
	deleteImage,
}
