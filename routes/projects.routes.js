const express = require('express')
const router = express.Router()
const {
	getAllProjects,
	getProjectByUID,
} = require('../controllers/projects.controller')

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Loyihalar (projects) bilan ishlash API (public read-only)
 */

/**
 * @swagger
 * /api/v2/projects:
 *   get:
 *     summary: Barcha loyihalarni olish (public)
 *     description: Portfolio egasining barcha loyihalarini ro'yxatini qaytaradi (faqat published loyihalar)
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli — loyihalar ro‘yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllProjects)

/**
 * @swagger
 * /api/v2/projects/{id}:
 *   get:
 *     summary: Bitta loyihani ID bo‘yicha olish (public)
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Loyiha MongoDB ID
 *     responses:
 *       200:
 *         description: Loyiha topildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Loyiha topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server xatosi
 */
router.get('/:id', getProjectById)

module.exports = router
