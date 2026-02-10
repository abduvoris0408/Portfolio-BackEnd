const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { createSchema, updateSchema } = require('../validators/service.validator')
const { uploadAboutFiles } = require('../config/cloudinary.config')
const {
    createSchema: detailCreateSchema,
    updateSchema: detailUpdateSchema,
} = require('../validators/serviceDetail.validator')

const {
    getServices,
    getService,
    createService,
    updateService,
    deleteService,
    uploadImage,
    deleteImage,
    getServiceDetails,
    getServiceDetail,
    createServiceDetail,
    updateServiceDetail,
    deleteServiceDetail,
} = require('../controllers/service.controller')

// ===== SERVICE =====
// Public
router.get('/', getServices)
router.get('/:id', getService)

// Private (Admin)
router.post('/', protect, validate(createSchema), createService)
router.put('/:id', protect, validate(updateSchema), updateService)
router.delete('/:id', protect, deleteService)

// Rasm yuklash
router.put('/:id/image', protect, uploadAboutFiles.single('image'), uploadImage)
router.delete('/:id/image', protect, deleteImage)

module.exports = router
