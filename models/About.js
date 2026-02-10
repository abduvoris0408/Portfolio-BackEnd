const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')

const About = sequelize.define('about', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    // ===== HERO SECTION =====
    fullName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'full_name',
        validate: { notEmpty: { msg: "To'liq ism kiritish majburiy" } },
    },
    title: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: { notEmpty: { msg: 'Unvon kiritish majburiy' } },
    },
    subtitle: {
        type: DataTypes.STRING(200),
        defaultValue: '',
    },
    typingTexts: {
        type: DataTypes.JSONB,
        defaultValue: [],
        field: 'typing_texts',
    },

    // ===== RASMLAR =====
    avatar: {
        type: DataTypes.JSONB,
        defaultValue: { url: '', publicId: '' },
    },
    coverImage: {
        type: DataTypes.JSONB,
        defaultValue: { url: '', publicId: '' },
        field: 'cover_image',
    },
    resume: {
        type: DataTypes.JSONB,
        defaultValue: { url: '', publicId: '' },
    },

    // ===== BIO =====
    bio: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: { msg: 'Bio kiritish majburiy' } },
    },
    shortBio: {
        type: DataTypes.STRING(500),
        defaultValue: '',
        field: 'short_bio',
    },

    // ===== SHAXSIY =====
    phone: { type: DataTypes.STRING(30), defaultValue: '' },
    email: { type: DataTypes.STRING(100), defaultValue: '' },
    address: { type: DataTypes.STRING(300), defaultValue: '' },
    birthday: { type: DataTypes.DATEONLY },
    nationality: { type: DataTypes.STRING(50), defaultValue: '' },
    freelanceStatus: {
        type: DataTypes.ENUM('available', 'busy', 'not_available'),
        defaultValue: 'available',
        field: 'freelance_status',
    },
    location: {
        type: DataTypes.JSONB,
        defaultValue: { city: '', country: '', mapUrl: '' },
    },

    // ===== TILLAR =====
    languages: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },

    // ===== IJTIMOIY TARMOQLAR =====
    socialLinks: {
        type: DataTypes.JSONB,
        defaultValue: {},
        field: 'social_links',
    },

    // ===== STATISTIKALAR =====
    stats: {
        type: DataTypes.JSONB,
        defaultValue: {
            projectsCompleted: 0,
            happyClients: 0,
            yearsExperience: 0,
            awardsWon: 0,
            coffeesDrunk: 0,
            linesOfCode: 0,
        },
    },

    // ===== QIZIQISHLAR =====
    interests: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },

    // ===== WHAT I DO =====
    whatIDo: {
        type: DataTypes.JSONB,
        defaultValue: [],
        field: 'what_i_do',
    },

    // ===== SEO =====
    seo: {
        type: DataTypes.JSONB,
        defaultValue: { metaTitle: '', metaDescription: '', metaKeywords: [], ogImage: '' },
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
    },
}, {
    tableName: 'about',
})

// Yosh virtual
About.prototype.getAge = function () {
    if (!this.birthday) return null
    const today = new Date()
    const birth = new Date(this.birthday)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
}

module.exports = About
