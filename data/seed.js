const { User } = require('../models')
const logger = require('../utils/logger')

const seedAdmin = async () => {
    try {
        const adminExists = await User.scope('withPassword').findOne({ where: { role: 'admin' } })

        if (adminExists) {
            logger.info(`✅ Admin mavjud: ${adminExists.email}`)
            return
        }

        const adminData = {
            name: process.env.ADMIN_NAME || 'Admin',
            email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
            password: process.env.ADMIN_PASSWORD || 'admin123456',
            role: 'admin',
        }

        const admin = await User.create(adminData)
        logger.info(`🔑 Admin yaratildi: ${admin.email}`)
        logger.info(`📧 Email: ${adminData.email}`)
        logger.info(`🔒 Parol: ${adminData.password}`)
        logger.info("⚠️  Parolni tezda o'zgartiring!")
    } catch (error) {
        logger.error(`Admin seed xatosi: ${error.message}`)
    }
}

module.exports = seedAdmin
