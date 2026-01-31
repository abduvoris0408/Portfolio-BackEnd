const express = require('express')
const router = express.Router()
const {
	getAllProjects,
	getProjectById,
} = require('../controllers/projects.controller')

router.get('/', getAllProjects)
router.get('/:id', getProjectById)

module.exports = router
