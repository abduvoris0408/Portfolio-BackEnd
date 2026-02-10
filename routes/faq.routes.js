const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')

const {
    getFaqs,
    getFaq,
    createFaq,
    updateFaq,
    deleteFaq,
} = require('../controllers/faq.controller')

// Public
router.get('/', getFaqs)
router.get('/:id', getFaq)

// Private (Admin)
router.post('/', protect, createFaq)
router.put('/:id', protect, updateFaq)
router.delete('/:id', protect, deleteFaq)

module.exports = router
