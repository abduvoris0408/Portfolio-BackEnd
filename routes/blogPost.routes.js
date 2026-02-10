const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { createSchema, updateSchema } = require('../validators/blogPost.validator')
const { uploadAboutFiles } = require('../config/cloudinary.config')

const {
    getBlogPosts,
    getBlogPost,
    getBlogPostBySlug,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    uploadImage,
    deleteImage,
} = require('../controllers/blogPost.controller')

// Public
router.get('/', getBlogPosts)
router.get('/slug/:slug', getBlogPostBySlug)
router.get('/:id', getBlogPost)

// Private (Admin)
router.post('/', protect, validate(createSchema), createBlogPost)
router.put('/:id', protect, validate(updateSchema), updateBlogPost)
router.delete('/:id', protect, deleteBlogPost)

// Rasm yuklash
router.put('/:id/image', protect, uploadAboutFiles.single('image'), uploadImage)
router.delete('/:id/image', protect, deleteImage)

module.exports = router
