const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const ApiFeatures = require('../utils/apiFeatures')
const { BlogPost, BlogComment, BlogRating, Category, Tag } = require('../models')
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary.config')

exports.getBlogPosts = asyncHandler(async (req, res, next) => {
    const features = new ApiFeatures(BlogPost, req.query)
        .filter()
        .search(['title', 'content', 'excerpt'])
        .sort()
        .select()
        .include([
            { model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] },
            { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug', 'color'], through: { attributes: [] } },
        ])

    const { data, pagination } = await features.paginate()

    const postsWithRatings = await Promise.all(
        data.map(async post => {
            const ratingData = await BlogRating.getAverageRating(post.id)
            const postObj = post.toJSON()
            postObj.averageRating = ratingData.averageRating
            postObj.totalRatings = ratingData.totalRatings
            return postObj
        }),
    )

    res.status(200).json({ success: true, count: postsWithRatings.length, pagination, data: postsWithRatings })
})

exports.getBlogPost = asyncHandler(async (req, res, next) => {
    const post = await BlogPost.findByPk(req.params.id, {
        include: [
            { model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] },
            { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug', 'color'], through: { attributes: [] } },
            {
                model: BlogComment, as: 'comments',
                where: { parentCommentId: null, status: 'approved' },
                required: false,
                include: [{ model: BlogComment, as: 'replies' }],
            },
        ],
    })
    if (!post) return next(new ErrorResponse('Maqola topilmadi', 404))

    await post.increment('views')
    const ratingData = await BlogRating.getAverageRating(post.id)
    const postObj = post.toJSON()
    postObj.averageRating = ratingData.averageRating
    postObj.totalRatings = ratingData.totalRatings

    res.status(200).json({ success: true, data: postObj })
})

exports.getBlogPostBySlug = asyncHandler(async (req, res, next) => {
    const post = await BlogPost.findOne({
        where: { slug: req.params.slug },
        include: [
            { model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] },
            { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug', 'color'], through: { attributes: [] } },
            {
                model: BlogComment, as: 'comments',
                where: { parentCommentId: null, status: 'approved' },
                required: false,
                include: [{ model: BlogComment, as: 'replies' }],
            },
        ],
    })
    if (!post) return next(new ErrorResponse('Maqola topilmadi', 404))

    await post.increment('views')
    const ratingData = await BlogRating.getAverageRating(post.id)
    const postObj = post.toJSON()
    postObj.averageRating = ratingData.averageRating
    postObj.totalRatings = ratingData.totalRatings

    res.status(200).json({ success: true, data: postObj })
})

exports.createBlogPost = asyncHandler(async (req, res, next) => {
    const post = await BlogPost.create(req.body)
    if (req.body.tags && req.body.tags.length > 0) await post.setTags(req.body.tags)

    const fullPost = await BlogPost.findByPk(post.id, {
        include: [
            { model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] },
            { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug', 'color'], through: { attributes: [] } },
        ],
    })
    res.status(201).json({ success: true, data: fullPost })
})

exports.updateBlogPost = asyncHandler(async (req, res, next) => {
    const post = await BlogPost.findByPk(req.params.id)
    if (!post) return next(new ErrorResponse('Maqola topilmadi', 404))
    await post.update(req.body)
    if (req.body.tags) await post.setTags(req.body.tags)

    const fullPost = await BlogPost.findByPk(post.id, {
        include: [
            { model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] },
            { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug', 'color'], through: { attributes: [] } },
        ],
    })
    res.status(200).json({ success: true, data: fullPost })
})

exports.deleteBlogPost = asyncHandler(async (req, res, next) => {
    const post = await BlogPost.findByPk(req.params.id)
    if (!post) return next(new ErrorResponse('Maqola topilmadi', 404))
    if (post.image?.publicId) await deleteFromCloudinary(post.image.publicId)
    await BlogComment.destroy({ where: { blogPostId: post.id } })
    await BlogRating.destroy({ where: { blogPostId: post.id } })
    await post.setTags([])
    await post.destroy()
    res.status(200).json({ success: true, message: "Maqola o'chirildi", data: {} })
})

// === RASM YUKLASH ===
exports.uploadImage = asyncHandler(async (req, res, next) => {
    const post = await BlogPost.findByPk(req.params.id)
    if (!post) return next(new ErrorResponse('Maqola topilmadi', 404))
    if (!req.file) return next(new ErrorResponse('Rasm tanlang', 400))

    if (post.image?.publicId) await deleteFromCloudinary(post.image.publicId)
    const result = await uploadToCloudinary(req.file.buffer, 'blog', {
        transformation: [{ width: 1200, height: 630, crop: 'limit', quality: 'auto' }],
    })
    await post.update({ image: result })
    res.status(200).json({ success: true, data: post })
})

exports.deleteImage = asyncHandler(async (req, res, next) => {
    const post = await BlogPost.findByPk(req.params.id)
    if (!post) return next(new ErrorResponse('Maqola topilmadi', 404))
    if (post.image?.publicId) await deleteFromCloudinary(post.image.publicId)

    post.image = null
    post.changed('image', true)
    await post.save()
    await post.reload()

    res.status(200).json({ success: true, message: "Rasm o'chirildi", data: post })
})
