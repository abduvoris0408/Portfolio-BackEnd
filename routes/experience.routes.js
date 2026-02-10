const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { createSchema, updateSchema } = require('../validators/experience.validator')
const { uploadAboutFiles } = require('../config/cloudinary.config')

const {
    getExperiences,
    getExperience,
    createExperience,
    updateExperience,
    deleteExperience,
    uploadLogo,
    deleteLogo,
} = require('../controllers/experience.controller')

// Public
router.get('/', getExperiences)
router.get('/:id', getExperience)

// Private (Admin)
router.post('/', protect, validate(createSchema), createExperience)
router.put('/:id', protect, validate(updateSchema), updateExperience)
router.delete('/:id', protect, deleteExperience)

// Logo yuklash
router.put('/:id/logo', protect, uploadAboutFiles.single('logo'), uploadLogo)
router.delete('/:id/logo', protect, deleteLogo)

module.exports = router
