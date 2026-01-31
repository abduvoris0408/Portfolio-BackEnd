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

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Loyihalar kategoriyalari bilan ishlash API
 */

/**
 * @swagger
 * /api/v2/categories:
 *   get:
 *     summary: Barcha kategoriyalarni olish
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli — kategoriyalar ro‘yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/').get(getCategories)

/**
 * @swagger
 * /api/v2/categories:
 *   post:
 *     summary: Yangi kategoriya yaratish (faqat admin/auth)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Kategoriya muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validatsiya xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Autentifikatsiya talab qilinadi
 */
router.route('/').post(protect, categoryValidation, validate, createCategory)

/**
 * @swagger
 * /api/v2/categories/{id}:
 *   get:
 *     summary: Bitta kategoriyani ID bo‘yicha olish
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Kategoriya MongoDB ID
 *     responses:
 *       200:
 *         description: Kategoriya topildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Kategoriya topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/:id').get(getCategory)

/**
 * @swagger
 * /api/v2/categories/{id}:
 *   put:
 *     summary: Kategoriyani yangilash (faqat admin/auth)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Kategoriya ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Kategoriya yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validatsiya xatosi
 *       401:
 *         description: Ruxsat yo‘q
 *       404:
 *         description: Kategoriya topilmadi
 */
router.route('/:id').put(protect, categoryValidation, validate, updateCategory)

/**
 * @swagger
 * /api/v2/categories/{id}:
 *   delete:
 *     summary: Kategoriyani o‘chirish (faqat admin/auth)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Kategoriya ID
 *     responses:
 *       200:
 *         description: Kategoriya muvaffaqiyatli o‘chirildi
 *       401:
 *         description: Ruxsat yo‘q
 *       404:
 *         description: Kategoriya topilmadi
 */
router.route('/:id').delete(protect, deleteCategory)

module.exports = router
