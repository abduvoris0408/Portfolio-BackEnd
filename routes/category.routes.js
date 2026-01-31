const express = require('express')
const {
	getCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
} = require('../controllers/category.controller')

const router = express.Router()

const { protect } = require('../middleware/auth.middleware')
const { categoryValidation, validate } = require('../middleware/validator')

router
	.route('/')
	.get(getCategories)
	.post(protect, categoryValidation, validate, createCategory)

router
	.route('/:id')
	.get(getCategory)
	.put(protect, categoryValidation, validate, updateCategory)
	.delete(protect, deleteCategory)

module.exports = router
