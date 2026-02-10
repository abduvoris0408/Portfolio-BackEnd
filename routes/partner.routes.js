const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const { uploadAboutFiles } = require('../config/cloudinary.config')

const {
    getPartners,
    getPartner,
    createPartner,
    updatePartner,
    deletePartner,
    uploadLogo,
    deleteLogo,
} = require('../controllers/partner.controller')

// Public
router.get('/', getPartners)
router.get('/:id', getPartner)

// Private (Admin)
router.post('/', protect, createPartner)
router.put('/:id', protect, updatePartner)
router.delete('/:id', protect, deletePartner)

// Logo yuklash
router.put('/:id/logo', protect, uploadAboutFiles.single('logo'), uploadLogo)
router.delete('/:id/logo', protect, deleteLogo)

module.exports = router
