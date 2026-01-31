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

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Loyihalar bilan ishlash API
 */

/**
 * @swagger
 * /api/v2/projects:
 *   get:
 *     summary: Barcha loyihalarni olish
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
router.route('/').get(getProjects)

/**
 * @swagger
 * /api/v2/projects:
 *   post:
 *     summary: Yangi loyiha yaratish (faqat admin/auth)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Loyiha muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validatsiya xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Autentifikatsiya talab qilinadi
 */
router.route('/').post(protect, projectValidation, validate, createProject)

/**
 * @swagger
 * /api/v2/projects/{id}:
 *   get:
 *     summary: Bitta loyihani ID bo‘yicha olish
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
 */
router.route('/:id').get(getProject)

/**
 * @swagger
 * /api/v2/projects/{id}:
 *   put:
 *     summary: Loyihani yangilash (faqat admin/auth)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Loyiha ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Loyiha yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validatsiya xatosi
 *       401:
 *         description: Ruxsat yo‘q
 *       404:
 *         description: Loyiha topilmadi
 */
router.route('/:id').put(protect, projectValidation, validate, updateProject)

/**
 * @swagger
 * /api/v2/projects/{id}:
 *   delete:
 *     summary: Loyihani o‘chirish (faqat admin/auth)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Loyiha ID
 *     responses:
 *       200:
 *         description: Loyiha muvaffaqiyatli o‘chirildi
 *       401:
 *         description: Ruxsat yo‘q
 *       404:
 *         description: Loyiha topilmadi
 */
router.route('/:id').delete(protect, deleteProject)

module.exports = router
