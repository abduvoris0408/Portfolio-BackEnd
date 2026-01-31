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

/**
 * @swagger
 * tags:
 *   name: Skills
 *   description: Ko'nikmalar (skills) bilan ishlash API (public GET + admin CRUD)
 */

/**
 * @swagger
 * /api/v2/skills:
 *   get:
 *     summary: Barcha ko'nikmalarni olish (public)
 *     description: Portfolio egasining barcha ko'nikmalarini ro'yxatini qaytaradi
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
router.route('/').get(getSkills)

/**
 * @swagger
 * /api/v2/skills:
 *   post:
 *     summary: Yangi ko'nikma yaratish (faqat admin/auth)
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Skill'
 *     responses:
 *       201:
 *         description: Ko'nikma muvaffaqiyatli yaratildi

 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       400:
 *         description: Validatsiya xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Autentifikatsiya talab qilinadi
 */
router.route('/').post(protect, skillValidation, validate, createSkill)

/**
 * @swagger
 * /api/v2/skills/{id}:
 *   get:
 *     summary: Bitta ko'nikmani ID bo‘yicha olish (public)
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
 */
router.route('/:id').get(getSkill)

/**
 * @swagger
 * /api/v2/skills/{id}:
 *   put:
 *     summary: Ko'nikmani yangilash (faqat admin/auth)
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ko'nikma ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Skill'
 *     responses:
 *       200:
 *         description: Ko'nikma yang yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       400:
 *         description: Validatsiya xatosi
 *       401:
 *         description: Ruxsat yo‘q
 *       404:
 *         description: Ko'nikma topilmadi
 */
router.route('/:id').put(protect, skillValidation, validate, updateSkill)

/**
 * @swagger
 * /api/v2/skills/{id}:
 *   delete:
 *     summary: Ko'nikmani o‘chirish (faqat admin/auth)
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ko'nikma ID
 *     responses:
 *       200:
 *         description: Ko'nikma muvaffaqiyatli o‘chirildi
 *       401:
 *         description: Ruxsat yo‘q
 *       404:
 *         description: Ko'nikma topilmadi
 */
router.route('/:id').delete(protect, deleteSkill)

module.exports = router
