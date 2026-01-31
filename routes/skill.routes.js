const express = require('express')
const {
	getSkills,
	getSkill,
	createSkill,
	updateSkill,
	deleteSkill,
} = require('../controllers/skill.controller')

const router = express.Router()

const { protect } = require('../middleware/auth.middleware')
const { skillValidation, validate } = require('../middleware/validator')

router
	.route('/')
	.get(getSkills)
	.post(protect, skillValidation, validate, createSkill)

router
	.route('/:id')
	.get(getSkill)
	.put(protect, skillValidation, validate, updateSkill)
	.delete(protect, deleteSkill)

module.exports = router
