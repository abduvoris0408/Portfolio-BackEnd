const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')

const Testimonial = sequelize.define('testimonials', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    clientName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'client_name',
        validate: { notEmpty: { msg: 'Mijoz ismini kiritish majburiy' } },
    },
    clientPosition: {
        type: DataTypes.STRING(200),
        defaultValue: '',
        field: 'client_position',
        comment: 'Lavozimi yoki kompaniyasi',
    },
    clientImage: {
        type: DataTypes.JSONB,
        defaultValue: null,
        field: 'client_image',
        comment: '{ url, publicId }',
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: { msg: 'Fikr matnini kiritish majburiy' } },
    },
    rating: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        validate: { min: 1, max: 5 },
    },
    caseType: {
        type: DataTypes.STRING(200),
        defaultValue: '',
        field: 'case_type',
        comment: 'Qanday ish turi bo\'yicha (masalan: "Fuqarolik ishi")',
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
    },
}, {
    tableName: 'testimonials',
    indexes: [
        { fields: ['order'] },
        { fields: ['is_active'] },
        { fields: ['rating'] },
    ],
})

module.exports = Testimonial
