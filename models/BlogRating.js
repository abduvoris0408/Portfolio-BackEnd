const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')

const BlogRating = sequelize.define('blog_ratings', {
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
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
    },
    ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'ip_address',
    },
}, {
    tableName: 'blog_ratings',
    indexes: [
        { unique: true, fields: ['blog_post_id', 'ip_address'] },
    ],
})

// Static method – o'rtacha reyting
BlogRating.getAverageRating = async function (blogPostId) {
    const result = await this.findOne({
        where: { blogPostId },
        attributes: [
            [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings'],
        ],
        raw: true,
    })

    return {
        averageRating: result.averageRating ? parseFloat(parseFloat(result.averageRating).toFixed(1)) : 0,
        totalRatings: parseInt(result.totalRatings) || 0,
    }
}

module.exports = BlogRating
