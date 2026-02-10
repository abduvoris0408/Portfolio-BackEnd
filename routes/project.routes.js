const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { createSchema, updateSchema } = require('../validators/project.validator')
const { uploadAboutFiles } = require('../config/cloudinary.config')

const {
	getProjects,
	getProject,
	createProject,
	updateProject,
	deleteProject,
	uploadImage,
	deleteImage,
	addGalleryImage,
	deleteGalleryImage,
} = require('../controllers/project.controller')

// Public
router.get('/', getProjects)
router.get('/:id', getProject)

// Private (Admin)
router.post('/', protect, validate(createSchema), createProject)
router.put('/:id', protect, validate(updateSchema), updateProject)
router.delete('/:id', protect, deleteProject)

// Rasm yuklash
router.put('/:id/image', protect, uploadAboutFiles.single('image'), uploadImage)
router.delete('/:id/image', protect, deleteImage)
router.put('/:id/gallery', protect, uploadAboutFiles.single('image'), addGalleryImage)
router.delete('/:id/gallery/:index', protect, deleteGalleryImage)

module.exports = router
