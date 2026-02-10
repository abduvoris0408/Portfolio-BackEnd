const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { createSchema, updateStatusSchema } = require('../validators/blogComment.validator')

const {
    getComments,
    getComment,
    getCommentsByPost,
    createComment,
    updateCommentStatus,
    deleteComment,
} = require('../controllers/blogComment.controller')

// Public
router.get('/', getComments)
router.get('/post/:postId', getCommentsByPost)
router.get('/:id', getComment)
router.post('/', validate(createSchema), createComment)

// Private (Admin)
router.put('/:id/status', protect, validate(updateStatusSchema), updateCommentStatus)
router.delete('/:id', protect, deleteComment)

module.exports = router
