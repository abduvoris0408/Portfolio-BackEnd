const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { createSchema } = require('../validators/blogRating.validator')

const {
    getRatings,
    createRating,
    deleteRatings,
} = require('../controllers/blogRating.controller')

// Public
router.get('/:postId', getRatings)
router.post('/', validate(createSchema), createRating)

// Private (Admin)
router.delete('/:postId', protect, deleteRatings)

module.exports = router
