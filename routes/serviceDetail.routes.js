const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { createSchema, updateSchema } = require('../validators/serviceDetail.validator')

const {
    getServiceDetails,
    getServiceDetail,
    createServiceDetail,
    updateServiceDetail,
    deleteServiceDetail,
} = require('../controllers/service.controller')

// Public
router.get('/', getServiceDetails)
router.get('/:id', getServiceDetail)

// Private (Admin)
router.post('/', protect, validate(createSchema), createServiceDetail)
router.put('/:id', protect, validate(updateSchema), updateServiceDetail)
router.delete('/:id', protect, deleteServiceDetail)

module.exports = router
