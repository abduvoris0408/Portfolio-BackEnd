const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const { uploadAboutFiles } = require('../config/cloudinary.config')

const {
    getAchievements,
    getAchievement,
    createAchievement,
    updateAchievement,
    deleteAchievement,
    uploadImage,
    deleteImage,
} = require('../controllers/achievement.controller')

// Public
router.get('/', getAchievements)
router.get('/:id', getAchievement)

// Private (Admin)
router.post('/', protect, createAchievement)
router.put('/:id', protect, updateAchievement)
router.delete('/:id', protect, deleteAchievement)

// Rasm yuklash
router.put('/:id/image', protect, uploadAboutFiles.single('image'), uploadImage)
router.delete('/:id/image', protect, deleteImage)

module.exports = router
