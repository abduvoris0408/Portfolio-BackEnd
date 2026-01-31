const express = require('express')
const router = express.Router()
const { getAbout } = require('../controllers/about.controller')

/**
 * @swagger
 * tags:
 *   name: About
 *   description: Portfolio haqida ma'lumot (about me)
 */

/**
 * @swagger
 * /api/v2/about:
 *   get:
 *     summary: Portfolio egasi haqida ma'lumot olish
 *     description: Foydalanuvchi (developer) haqidagi umumiy ma'lumotni qaytaradi (bio, tajriba, kontakt va h.k.)
 *     tags: [About]
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli — about ma'lumoti qaytadi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     bio:
 *                       type: string
 *                       example: "Full-stack developer with 3+ years experience..."
 *                     experience:
 *                       type: string
 *                       example: "3 yillik tajriba"
 *                     location:
 *                       type: string
 *                       example: "Toshkent, O'zbekiston"
 *                     email:
 *                       type: string
 *                       example: "abduvoris@example.com"
 *                     socialLinks:
 *                       type: object
 *                       properties:
 *                         github:
 *                           type: string
 *                         linkedin:
 *                           type: string
 *                         telegram:
 *                           type: string
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.get('/', getAbout)

module.exports = router
