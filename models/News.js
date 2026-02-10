const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')
const slugify = require('../utils/slugify')

const News = sequelize.define('news', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(300),
        allowNull: false,
        validate: { notEmpty: { msg: 'Sarlavha kiritish majburiy' } },
    },
    slug: {
        type: DataTypes.STRING(350),
        unique: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    excerpt: {
        type: DataTypes.STRING(500),
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
    source: {
        type: DataTypes.STRING(200),
        defaultValue: '',
    },
    sourceUrl: {
        type: DataTypes.STRING(500),
        defaultValue: '',
        field: 'source_url',
    },
    status: {
        type: DataTypes.ENUM('published', 'draft', 'archived'),
        defaultValue: 'draft',
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_featured',
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    publishedAt: {
        type: DataTypes.DATE,
        field: 'published_at',
    },
}, {
    tableName: 'news',
    indexes: [
        { fields: ['slug'] },
        { fields: ['status'] },
        { fields: ['category_id'] },
        { fields: ['published_at'] },
    ],
    hooks: {
        beforeValidate: (news) => {
            if (news.title && (news.isNewRecord || news.changed('title'))) {
                news.slug = slugify(news.title)
            }
            if (news.status === 'published' && !news.publishedAt) {
                news.publishedAt = new Date()
            }
        },
    },
})

module.exports = News
