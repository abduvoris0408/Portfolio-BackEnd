const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { createSchema, updateSchema } = require('../validators/category.validator')
const { uploadAboutFiles } = require('../config/cloudinary.config')

const {
	getCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
	uploadImage,
	deleteImage,
} = require('../controllers/category.controller')

// Public
router.get('/', getCategories)
router.get('/:id', getCategory)

// Private (Admin)
router.post('/', protect, validate(createSchema), createCategory)
router.put('/:id', protect, validate(updateSchema), updateCategory)
router.delete('/:id', protect, deleteCategory)

// Rasm yuklash
router.put('/:id/image', protect, uploadAboutFiles.single('image'), uploadImage)
router.delete('/:id/image', protect, deleteImage)

module.exports = router
