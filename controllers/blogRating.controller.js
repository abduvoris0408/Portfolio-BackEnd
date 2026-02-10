const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const { BlogRating, BlogPost } = require('../models')

exports.getRatings = asyncHandler(async (req, res, next) => {
    const post = await BlogPost.findByPk(req.params.postId)
    if (!post) return next(new ErrorResponse(`Blog post topilmadi: ${req.params.postId}`, 404))

    const ratingData = await BlogRating.getAverageRating(post.id)
    const ratings = await BlogRating.findAll({
        where: { blogPostId: post.id },
        order: [['created_at', 'DESC']],
        attributes: { exclude: ['ipAddress', 'ip_address'] },
    })

    res.status(200).json({ success: true, data: { ...ratingData, ratings } })
})

exports.createRating = asyncHandler(async (req, res, next) => {
    const { blogPostId, rating } = req.body
    const ipAddress = req.ip || req.connection.remoteAddress

    const post = await BlogPost.findByPk(blogPostId)
    if (!post) return next(new ErrorResponse(`Blog post topilmadi: ${blogPostId}`, 404))

    let existing = await BlogRating.findOne({ where: { blogPostId, ipAddress } })

    if (existing) {
        await existing.update({ rating })
        const ratingData = await BlogRating.getAverageRating(post.id)
        return res.status(200).json({
            success: true, message: 'Reytingingiz yangilandi',
            data: { rating: existing, ...ratingData },
        })
    }

    const newRating = await BlogRating.create({ blogPostId, rating, ipAddress })
    const ratingData = await BlogRating.getAverageRating(post.id)

    res.status(201).json({
        success: true, message: 'Reytingingiz qabul qilindi',
        data: { rating: newRating, ...ratingData },
    })
})

exports.deleteRatings = asyncHandler(async (req, res, next) => {
    const result = await BlogRating.destroy({ where: { blogPostId: req.params.postId } })
    res.status(200).json({ success: true, message: `${result} ta reyting o'chirildi`, data: {} })
})
