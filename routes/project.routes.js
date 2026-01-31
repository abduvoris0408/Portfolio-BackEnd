const express = require('express')
const {
	getProjects,
	getProject,
	createProject,
	updateProject,
	deleteProject,
} = require('../controllers/project.controller')

const router = express.Router()

const { protect } = require('../middleware/auth.middleware')
const { projectValidation, validate } = require('../middleware/validator')

router
	.route('/')
	.get(getProjects)
	.post(protect, projectValidation, validate, createProject)

router
	.route('/:id')
	.get(getProject)
	.put(protect, projectValidation, validate, updateProject)
	.delete(protect, deleteProject)

module.exports = router
