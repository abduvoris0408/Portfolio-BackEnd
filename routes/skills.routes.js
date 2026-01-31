const express = require('express')
const router = express.Router()
const {
	getAllSkills,
	getSkillById,
} = require('../controllers/skills.controller')

router.get('/', getAllSkills)
router.get('/:id', getSkillById)

module.exports = router
