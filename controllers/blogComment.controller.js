const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const ApiFeatures = require('../utils/apiFeatures')
const { BlogComment, BlogPost } = require('../models')

exports.getComments = asyncHandler(async (req, res, next) => {
    const features = new ApiFeatures(BlogComment, req.query)
        .filter()
        .search(['content', 'guestName'])
        .sort()
        .select()
        .include([
            { model: BlogPost, as: 'blogPost', attributes: ['id', 'title', 'slug'] },
            { model: BlogComment, as: 'replies' },
        ])

    const { data, pagination } = await features.paginate()
    res.status(200).json({ success: true, count: data.length, pagination, data })
})

exports.getCommentsByPost = asyncHandler(async (req, res, next) => {
    const post = await BlogPost.findByPk(req.params.postId)
    if (!post) return next(new ErrorResponse(`Blog post topilmadi: ${req.params.postId}`, 404))

    const features = new ApiFeatures(BlogComment, req.query)
        .sort()
        .include([{ model: BlogComment, as: 'replies' }])

    features.queryOptions.where.blogPostId = req.params.postId
    features.queryOptions.where.parentCommentId = null
    features.queryOptions.where.status = 'approved'

    const { data, pagination } = await features.paginate()
    res.status(200).json({ success: true, count: data.length, pagination, data })
})

exports.getComment = asyncHandler(async (req, res, next) => {
    const comment = await BlogComment.findByPk(req.params.id, {
        include: [
            { model: BlogPost, as: 'blogPost', attributes: ['id', 'title', 'slug'] },
            { model: BlogComment, as: 'replies' },
        ],
    })
    if (!comment) return next(new ErrorResponse(`Izoh topilmadi: ${req.params.id}`, 404))
    res.status(200).json({ success: true, data: comment })
})

exports.createComment = asyncHandler(async (req, res, next) => {
    const post = await BlogPost.findByPk(req.body.blogPostId || req.body.blog_post_id)
    if (!post) return next(new ErrorResponse('Blog post topilmadi', 404))
    if (!post.allowComments) return next(new ErrorResponse('Bu post uchun izohlar yopilgan', 403))

    if (req.body.parentCommentId) {
        const parent = await BlogComment.findByPk(req.body.parentCommentId)
        if (!parent) return next(new ErrorResponse('Asosiy izoh topilmadi', 404))
        if (parent.blogPostId !== (req.body.blogPostId || req.body.blog_post_id)) {
            return next(new ErrorResponse('Izoh boshqa postga tegishli', 400))
        }
    }

    req.body.ipAddress = req.ip || req.connection.remoteAddress
    const comment = await BlogComment.create(req.body)

    res.status(201).json({ success: true, message: 'Izohingiz moderatsiyaga yuborildi', data: comment })
})

exports.updateCommentStatus = asyncHandler(async (req, res, next) => {
    const comment = await BlogComment.findByPk(req.params.id)
    if (!comment) return next(new ErrorResponse(`Izoh topilmadi: ${req.params.id}`, 404))

    await comment.update({ status: req.body.status })

    res.status(200).json({
        success: true,
        message: `Izoh ${req.body.status === 'approved' ? 'tasdiqlandi' : 'rad etildi'}`,
        data: comment,
    })
})

exports.deleteComment = asyncHandler(async (req, res, next) => {
    const comment = await BlogComment.findByPk(req.params.id)
    if (!comment) return next(new ErrorResponse(`Izoh topilmadi: ${req.params.id}`, 404))

    await BlogComment.destroy({ where: { parentCommentId: comment.id } })
    await comment.destroy()

    res.status(200).json({ success: true, message: "Izoh o'chirildi", data: {} })
})
