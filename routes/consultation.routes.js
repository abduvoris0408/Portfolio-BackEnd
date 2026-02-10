const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')

const {
    createConsultation,
    getConsultations,
    getConsultation,
    updateConsultationStatus,
    deleteConsultation,
} = require('../controllers/consultation.controller')

// Public – mijoz maslahat so'rovi yuboradi
router.post('/', createConsultation)

// Private (Admin)
router.get('/', protect, getConsultations)
router.get('/:id', protect, getConsultation)
router.put('/:id', protect, updateConsultationStatus)
router.delete('/:id', protect, deleteConsultation)

module.exports = router
