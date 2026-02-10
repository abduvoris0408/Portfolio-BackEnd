const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')

const Contact = sequelize.define('contacts', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: { msg: 'Ism kiritish majburiy' } },
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Email kiritish majburiy' },
            isEmail: { msg: "Email formati noto'g'ri" },
        },
    },
    phone: {
        type: DataTypes.STRING(30),
        defaultValue: '',
    },
    subject: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: { msg: 'Mavzu kiritish majburiy' } },
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: { msg: 'Xabar kiritish majburiy' } },
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_read',
    },
    isReplied: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_replied',
    },
    repliedAt: {
        type: DataTypes.DATE,
        field: 'replied_at',
    },
    ipAddress: {
        type: DataTypes.STRING(45),
        defaultValue: '',
        field: 'ip_address',
    },
}, {
    tableName: 'contacts',
    indexes: [
        { fields: ['is_read'] },
        { fields: ['created_at'] },
    ],
})

module.exports = Contact
