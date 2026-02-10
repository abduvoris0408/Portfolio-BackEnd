const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')

const Achievement = sequelize.define('achievements', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(300),
        allowNull: false,
        validate: { notEmpty: { msg: 'Yutuq nomini kiritish majburiy' } },
    },
    issuer: {
        type: DataTypes.STRING(200),
        defaultValue: '',
        comment: 'Bergan tashkilot',
    },
    date: {
        type: DataTypes.DATEONLY,
        comment: 'Berilgan sana',
    },
    image: {
        type: DataTypes.JSONB,
        defaultValue: null,
        comment: '{ url, publicId } – sertifikat rasmi',
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: '',
    },
    type: {
        type: DataTypes.ENUM('license', 'certificate', 'award', 'membership'),
        defaultValue: 'certificate',
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
    tableName: 'achievements',
    indexes: [
        { fields: ['type'] },
        { fields: ['order'] },
        { fields: ['is_active'] },
    ],
})

module.exports = Achievement
