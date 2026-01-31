const express = require('express')
const {
	register,
	login,
	logout,
	getMe,
	updateDetails,
	updatePassword,
} = require('../controllers/auth.controller')

const router = express.Router()

const { protect } = require('../middleware/auth.middleware')
const {
	registerValidation,
	loginValidation,
	validate,
} = require('../middleware/validator')

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Foydalanuvchi autentifikatsiyasi va profil boshqaruvi
 */

/**
 * @swagger
 * /api/v2/auth/register:
 *   post:
 *     summary: Yangi foydalanuvchi ro'yxatdan o'tkazish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Abduvoris
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       201:
 *         description: Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validatsiya xatosi yoki email allaqachon mavjud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', registerValidation, validate, register)

/**
 * @swagger
 * /api/v2/auth/login:
 *   post:
 *     summary: Foydalanuvchi tizimga kirish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli kirish — JWT token qaytadi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Noto'g'ri email yoki parol
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', loginValidation, validate, login)

/**
 * @swagger
 * /api/v2/auth/logout:
 *   get:
 *     summary: Foydalanuvchidan chiqish
 *     description: Cookie dagi tokenni o'chiradi (agar cookie ishlatayotgan bo'lsangiz)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli chiqildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */
router.get('/logout', logout)

/**
 * @swagger
 * /api/v2/auth/me:
 *   get:
 *     summary: Joriy foydalanuvchi ma'lumotlarini olish
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Joriy foydalanuvchi ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Autentifikatsiya talab qilinadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', protect, getMe)

/**
 * @swagger
 * /api/v2/auth/updatedetails:
 *   put:
 *     summary: Foydalanuvchi profilini yangilash (name, email, bio va h.k.)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Yangi ism
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *               bio:
 *                 type: string
 *                 example: Yangi bio matni
 *     responses:
 *       200:
 *         description: Profil muvaffaqiyatli yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validatsiya xatosi
 *       401:
 *         description: Ruxsat yo'q
 */
router.put('/updatedetails', protect, updateDetails)

/**
 * @swagger
 * /api/v2/auth/updatepassword:
 *   put:
 *     summary: Parolni yangilash
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: eskiParol123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: yangiParol456
 *     responses:
 *       200:
 *         description: Parol muvaffaqiyatli yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Jori parol noto'g'ri
 *       401:
 *         description: Ruxsat yo'q
 */
router.put('/updatepassword', protect, updatePassword)

module.exports = router
