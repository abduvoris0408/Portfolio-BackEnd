const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { createSchema } = require('../validators/contact.validator')

const {
    getContacts,
    getContact,
    createContact,
    markAsRead,
    markAsReplied,
    deleteContact,
} = require('../controllers/contact.controller')

// Public
router.post('/', validate(createSchema), createContact)

// Private (Admin)
router.get('/', protect, getContacts)
router.get('/:id', protect, getContact)
router.put('/:id/read', protect, markAsRead)
router.put('/:id/reply', protect, markAsReplied)
router.delete('/:id', protect, deleteContact)

module.exports = router

