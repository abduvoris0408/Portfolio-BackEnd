const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { createSchema, updateSchema } = require('../validators/tag.validator')

const {
    getTags,
    getTag,
    createTag,
    updateTag,
    deleteTag,
} = require('../controllers/tag.controller')

// Public
router.get('/', getTags)
router.get('/:id', getTag)

// Private (Admin)
router.post('/', protect, validate(createSchema), createTag)
router.put('/:id', protect, validate(updateSchema), updateTag)
router.delete('/:id', protect, deleteTag)

module.exports = router
