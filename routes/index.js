const express = require('express')
const router = express.Router()

const aboutRoutes = require('./about.routes')
const skillsRoutes = require('./skills.routes')
const projectsRoutes = require('./projects.routes')

router.use('/about', aboutRoutes)
router.use('/skills', skillsRoutes)
router.use('/projects', projectsRoutes)

module.exports = router
