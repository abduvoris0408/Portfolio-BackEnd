const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')
const slugify = require('../utils/slugify')

const Service = sequelize.define('services', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: { msg: 'Xizmat nomi kiritish majburiy' } },
    },
    slug: {
        type: DataTypes.STRING(250),
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    icon: {
        type: DataTypes.STRING(100),
        defaultValue: '',
    },
    image: {
        type: DataTypes.JSONB,
        defaultValue: null,
        comment: '{ url, publicId }',
    },
    categoryId: {
        type: DataTypes.UUID,
        field: 'category_id',
        references: { model: 'categories', key: 'id' },
    },
    price: {
        type: DataTypes.STRING(50),
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
    tableName: 'services',
    indexes: [
        { fields: ['slug'] },
        { fields: ['category_id'] },
        { fields: ['order'] },
    ],
    hooks: {
        beforeValidate: (service) => {
            if (service.title && (service.isNewRecord || service.changed('title'))) {
                service.slug = slugify(service.title)
            }
        },
    },
})

module.exports = Service
