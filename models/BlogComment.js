const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')

const BlogComment = sequelize.define('blog_comments', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    blogPostId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'blog_post_id',
        references: { model: 'blog_posts', key: 'id' },
    },
    parentCommentId: {
        type: DataTypes.UUID,
        field: 'parent_comment_id',
        references: { model: 'blog_comments', key: 'id' },
    },
    guestName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'guest_name',
        validate: { notEmpty: { msg: 'Ism kiritish majburiy' } },
    },
    guestEmail: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        field: 'guest_email',
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: { msg: 'Izoh matni kiritish majburiy' } },
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
    },
    ipAddress: {
        type: DataTypes.STRING(45),
        defaultValue: '',
        field: 'ip_address',
    },
}, {
    tableName: 'blog_comments',
    indexes: [
        { fields: ['blog_post_id'] },
        { fields: ['parent_comment_id'] },
        { fields: ['status'] },
    ],
})

module.exports = BlogComment
