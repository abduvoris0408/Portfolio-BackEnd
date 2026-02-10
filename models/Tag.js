const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')
const slugify = require('../utils/slugify')

const Tag = sequelize.define('tags', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: { msg: 'Bu teg allaqachon mavjud' },
        validate: { notEmpty: { msg: 'Teg nomi kiritish majburiy' } },
    },
    slug: {
        type: DataTypes.STRING(70),
    },
    color: {
        type: DataTypes.STRING(20),
        defaultValue: '#6366F1',
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
    },
}, {
    tableName: 'tags',
    indexes: [
        { fields: ['slug'] },
    ],
    hooks: {
        beforeValidate: (tag) => {
            if (tag.name) {
                tag.slug = slugify(tag.name)
            }
        },
    },
})

module.exports = Tag
