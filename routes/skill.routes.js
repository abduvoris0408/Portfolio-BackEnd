const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { createSchema, updateSchema } = require('../validators/skill.validator')
const { uploadAboutFiles } = require('../config/cloudinary.config')

const {
	getSkills,
	getSkill,
	createSkill,
	updateSkill,
	deleteSkill,
	uploadImage,
	deleteImage,
} = require('../controllers/skill.controller')

// Public
router.get('/', getSkills)
router.get('/:id', getSkill)

// Private (Admin)
router.post('/', protect, validate(createSchema), createSkill)
router.put('/:id', protect, validate(updateSchema), updateSkill)
router.delete('/:id', protect, deleteSkill)

// Rasm yuklash
router.put('/:id/image', protect, uploadAboutFiles.single('image'), uploadImage)
router.delete('/:id/image', protect, deleteImage)

module.exports = router
