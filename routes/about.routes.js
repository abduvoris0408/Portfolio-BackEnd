const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { createOrUpdateSchema } = require('../validators/about.validator')
const { uploadAboutFiles } = require('../config/cloudinary.config')

const {
    getAbout,
    getAboutAdmin,
    createOrUpdateAbout,
    uploadAvatar,
    uploadCover,
    uploadResume,
    deleteAvatar,
    deleteCover,
    deleteResume,
    updateSection,
    deleteAbout,
} = require('../controllers/about.controller')

// ===== PUBLIC =====
router.get('/', getAbout)

// ===== PRIVATE (ADMIN) =====
router.get('/admin', protect, getAboutAdmin)
router.post('/', protect, validate(createOrUpdateSchema), createOrUpdateAbout)
router.delete('/', protect, deleteAbout)

// Rasm va fayl yuklash
router.put('/avatar', protect, uploadAboutFiles.single('avatar'), uploadAvatar)
router.put('/cover', protect, uploadAboutFiles.single('cover'), uploadCover)
router.put('/resume', protect, uploadAboutFiles.single('resume'), uploadResume)

// Rasm va fayl o'chirish
router.delete('/avatar', protect, deleteAvatar)
router.delete('/cover', protect, deleteCover)
router.delete('/resume', protect, deleteResume)

// Bo'lim yangilash (PATCH)
router.patch('/:section', protect, updateSection)

module.exports = router
