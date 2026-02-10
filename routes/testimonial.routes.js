const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const { uploadAboutFiles } = require('../config/cloudinary.config')

const {
    getTestimonials,
    getTestimonial,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    uploadClientImage,
    deleteClientImage,
} = require('../controllers/testimonial.controller')

// Public
router.get('/', getTestimonials)
router.get('/:id', getTestimonial)

// Private (Admin)
router.post('/', protect, createTestimonial)
router.put('/:id', protect, updateTestimonial)
router.delete('/:id', protect, deleteTestimonial)

// Rasm yuklash
router.put('/:id/image', protect, uploadAboutFiles.single('image'), uploadClientImage)
router.delete('/:id/image', protect, deleteClientImage)

module.exports = router
