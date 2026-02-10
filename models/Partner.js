const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')

const Partner = sequelize.define('partners', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: { msg: 'Hamkor nomini kiritish majburiy' } },
    },
    logo: {
        type: DataTypes.JSONB,
        defaultValue: null,
        comment: '{ url, publicId }',
    },
    url: {
        type: DataTypes.STRING(500),
        defaultValue: '',
        comment: 'Hamkor saytiga havola',
    },
    description: {
        type: DataTypes.STRING(500),
        defaultValue: '',
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
    tableName: 'partners',
    indexes: [
        { fields: ['order'] },
        { fields: ['is_active'] },
    ],
})

module.exports = Partner
