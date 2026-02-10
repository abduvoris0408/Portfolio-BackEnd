const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')

const Faq = sequelize.define('faqs', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    question: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: { notEmpty: { msg: 'Savolni kiritish majburiy' } },
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: { msg: 'Javobni kiritish majburiy' } },
    },
    categoryId: {
        type: DataTypes.UUID,
        field: 'category_id',
        references: { model: 'categories', key: 'id' },
        comment: 'Huquq sohasi kategoriyasi',
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
    tableName: 'faqs',
    indexes: [
        { fields: ['category_id'] },
        { fields: ['order'] },
        { fields: ['is_active'] },
    ],
})

module.exports = Faq
