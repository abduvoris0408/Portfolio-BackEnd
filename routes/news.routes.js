const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { createSchema, updateSchema } = require('../validators/news.validator')
const { uploadAboutFiles } = require('../config/cloudinary.config')

const {
    getNews,
    getNewsItem,
    getNewsBySlug,
    createNews,
    updateNews,
    deleteNews,
    uploadImage,
    deleteImage,
} = require('../controllers/news.controller')

// Public
router.get('/', getNews)
router.get('/slug/:slug', getNewsBySlug)
router.get('/:id', getNewsItem)

// Private (Admin)
router.post('/', protect, validate(createSchema), createNews)
router.put('/:id', protect, validate(updateSchema), updateNews)
router.delete('/:id', protect, deleteNews)

// Rasm yuklash
router.put('/:id/image', protect, uploadAboutFiles.single('image'), uploadImage)
router.delete('/:id/image', protect, deleteImage)

module.exports = router
