const express = require('express')
const {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
} = require('../controllers/user.controller')

const router = express.Router()

const { protect, authorize } = require('../middleware/auth.middleware')

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Foydalanuvchilar bilan ishlash API (faqat admin uchun)
 */

// Barcha route'lar protect va admin uchun
router.use(protect)
router.use(authorize('admin'))

/**
 * @swagger
 * /api/v2/users:
 *   get:
 *     summary: Barcha foydalanuvchilarni olish (faqat admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli — foydalanuvchilar ro‘yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Autentifikatsiya talab qilinadi
 *       403:
 *         description: Ruxsat yo‘q (admin emas)
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/').get(getUsers)

/**
 * @swagger
 * /api/v2/users:
 *   post:
 *     summary: Yangi foydalanuvchi yaratish (faqat admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Foydalanuvchi muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validatsiya xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Autentifikatsiya talab qilinadi
 *       403:
 *         description: Ruxsat yo‘q (admin emas)
 */
router.route('/').post(createUser)

/**
 * @swagger
 * /api/v2/users/{id}:
 *   get:
 *     summary: Bitta foydalanuvchini ID bo‘yicha olish (faqat admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Foydalanuvchi MongoDB ID
 *     responses:
 *       200:
 *         description: Foydalanuvchi topildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Autentifikatsiya talab qilinadi
 *       403:
 *         description: Ruxsat yo‘q (admin emas)
 *       404:
 *         description: Foydalanuvchi topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/:id').get(getUser)

/**
 * @swagger
 * /api/v2/users/{id}:
 *   put:
 *     summary: Foydalanuvchini yangilash (faqat admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Foydalanuvchi ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Foydalanuvchi yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validatsiya xatosi
 *       401:
 *         description: Autentifikatsiya talab qilinadi
 *       403:
 *         description: Ruxsat yo‘q (admin emas)
 *       404:
 *         description: Foydalanuvchi topilmadi
 */
router.route('/:id').put(updateUser)

/**
 * @swagger
 * /api/v2/users/{id}:
 *   delete:
 *     summary: Foydalanuvchini o‘chirish (faqat admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Foydalanuvchi ID
 *     responses:
 *       200:
 *         description: Foydalanuvchi muvaffaqiyatli o‘chirildi
 *       401:
 *         description: Autentifikatsiya talab qilinadi
 *       403:
 *         description: Ruxsat yo‘q (admin emas)
 *       404:
 *         description: Foydalanuvchi topilmadi
 */
router.route('/:id').delete(deleteUser)

module.exports = router