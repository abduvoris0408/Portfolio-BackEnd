const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')
const slugify = require('../utils/slugify')

const BlogPost = sequelize.define('blog_posts', {
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
    readTime: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        field: 'read_time',
    },
    allowComments: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'allow_comments',
    },
    metaTitle: {
        type: DataTypes.STRING(70),
        defaultValue: '',
        field: 'meta_title',
    },
    metaDescription: {
        type: DataTypes.STRING(160),
        defaultValue: '',
        field: 'meta_description',
    },
    publishedAt: {
        type: DataTypes.DATE,
        field: 'published_at',
    },
}, {
    tableName: 'blog_posts',
    indexes: [
        { fields: ['slug'] },
        { fields: ['status'] },
        { fields: ['category_id'] },
        { fields: ['published_at'] },
    ],
    hooks: {
        beforeValidate: (post) => {
            if (post.title && (post.isNewRecord || post.changed('title'))) {
                post.slug = slugify(post.title)
            }
            if (post.content && (post.isNewRecord || post.changed('content'))) {
                const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length
                post.readTime = Math.max(1, Math.ceil(wordCount / 200))
            }
            if (post.status === 'published' && !post.publishedAt) {
                post.publishedAt = new Date()
            }
        },
    },
})

module.exports = BlogPost
