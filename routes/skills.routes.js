const express = require('express')
const router = express.Router()
const {
	getAllSkills,
	getSkillById,
} = require('../controllers/skills.controller')

/**
 * @swagger
 * tags:
 *   name: Skills
 *   description: Ko'nikmalar (skills) bilan ishlash API (public)
 */

/**
 * @swagger
 * /api/v2/skills:
 *   get:
 *     summary: Barcha ko'nikmalarni olish
 *     description: Portfolio egasining barcha ko'nikmalarini (masalan, JavaScript 85%, React 90% va h.k.) ro'yxatini qaytaradi
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli — ko'nikmalar ro‘yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Skill'
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllSkills)

/**
 * @swagger
 * /api/v2/skills/{id}:
 *   get:
 *     summary: Bitta ko'nikmani ID bo‘yicha olish
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ko'nikma MongoDB ID
 *     responses:
 *       200:
 *         description: Ko'nikma topildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       404:
 *         description: Ko'nikma topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server xatosi
 */
router.get('/:id', getSkillById)

module.exports = router
