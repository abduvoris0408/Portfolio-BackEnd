const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { createSchema, updateSchema } = require('../validators/education.validator')
const { uploadAboutFiles } = require('../config/cloudinary.config')

const {
    getEducation,
    getEducationItem,
    createEducation,
    updateEducation,
    deleteEducation,
    uploadLogo,
    deleteLogo,
} = require('../controllers/education.controller')

// Public
router.get('/', getEducation)
router.get('/:id', getEducationItem)

// Private (Admin)
router.post('/', protect, validate(createSchema), createEducation)
router.put('/:id', protect, validate(updateSchema), updateEducation)
router.delete('/:id', protect, deleteEducation)

// Logo yuklash
router.put('/:id/logo', protect, uploadAboutFiles.single('logo'), uploadLogo)
router.delete('/:id/logo', protect, deleteLogo)

module.exports = router
