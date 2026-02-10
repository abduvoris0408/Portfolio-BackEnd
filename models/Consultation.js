const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')

const Consultation = sequelize.define('consultations', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    fullName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'full_name',
        validate: { notEmpty: { msg: 'Ismni kiritish majburiy' } },
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: { notEmpty: { msg: 'Telefon raqamni kiritish majburiy' } },
    },
    email: {
        type: DataTypes.STRING(200),
        defaultValue: '',
    },
    serviceId: {
        type: DataTypes.UUID,
        field: 'service_id',
        references: { model: 'services', key: 'id' },
        comment: 'Qaysi xizmat uchun maslahat',
    },
    preferredDate: {
        type: DataTypes.DATEONLY,
        field: 'preferred_date',
        comment: 'Istalgan sana',
    },
    preferredTime: {
        type: DataTypes.STRING(10),
        defaultValue: '',
        field: 'preferred_time',
        comment: 'Istalgan vaqt: "14:00"',
    },
    message: {
        type: DataTypes.TEXT,
        defaultValue: '',
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        defaultValue: 'pending',
    },
    adminNotes: {
        type: DataTypes.TEXT,
        defaultValue: '',
        field: 'admin_notes',
        comment: 'Admin uchun ichki eslatma',
    },
    ipAddress: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        field: 'ip_address',
    },
}, {
    tableName: 'consultations',
    indexes: [
        { fields: ['status'] },
        { fields: ['service_id'] },
        { fields: ['preferred_date'] },
        { fields: ['created_at'] },
    ],
})

module.exports = Consultation
