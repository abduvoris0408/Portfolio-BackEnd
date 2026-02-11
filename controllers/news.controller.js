const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const ApiFeatures = require('../utils/apiFeatures')
const { News, Category, Tag } = require('../models')
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary.config')

exports.getNews = asyncHandler(async (req, res, next) => {
    const features = new ApiFeatures(News, req.query)
        .filter()
        .search(['title', 'content', 'excerpt'])
        .sort()
        .select()
        .include([
            { model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] },
            { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug', 'color'], through: { attributes: [] } },
        ])

    const { data, pagination } = await features.paginate()
    res.status(200).json({ success: true, count: data.length, pagination, data })
})

exports.getNewsItem = asyncHandler(async (req, res, next) => {
    const news = await News.findByPk(req.params.id, {
        include: [
            { model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] },
            { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug', 'color'], through: { attributes: [] } },
        ],
    })
    if (!news) return next(new ErrorResponse('Yangilik topilmadi', 404))
    await news.increment('views')
    res.status(200).json({ success: true, data: news })
})

exports.getNewsBySlug = asyncHandler(async (req, res, next) => {
    const news = await News.findOne({
        where: { slug: req.params.slug },
        include: [
            { model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] },
            { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug', 'color'], through: { attributes: [] } },
        ],
    })
    if (!news) return next(new ErrorResponse('Yangilik topilmadi', 404))
    await news.increment('views')
    res.status(200).json({ success: true, data: news })
})

exports.createNews = asyncHandler(async (req, res, next) => {
    const news = await News.create(req.body)
    if (req.body.tags && req.body.tags.length > 0) await news.setTags(req.body.tags)

    const fullNews = await News.findByPk(news.id, {
        include: [
            { model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] },
            { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug', 'color'], through: { attributes: [] } },
        ],
    })
    res.status(201).json({ success: true, data: fullNews })
})

exports.updateNews = asyncHandler(async (req, res, next) => {
    const news = await News.findByPk(req.params.id)
    if (!news) return next(new ErrorResponse('Yangilik topilmadi', 404))
    await news.update(req.body)
    if (req.body.tags) await news.setTags(req.body.tags)

    const fullNews = await News.findByPk(news.id, {
        include: [
            { model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] },
            { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug', 'color'], through: { attributes: [] } },
        ],
    })
    res.status(200).json({ success: true, data: fullNews })
})

exports.deleteNews = asyncHandler(async (req, res, next) => {
    const news = await News.findByPk(req.params.id)
    if (!news) return next(new ErrorResponse('Yangilik topilmadi', 404))
    if (news.image?.publicId) await deleteFromCloudinary(news.image.publicId)
    await news.setTags([])
    await news.destroy()
    res.status(200).json({ success: true, message: "Yangilik o'chirildi", data: {} })
})

// === RASM YUKLASH ===
exports.uploadImage = asyncHandler(async (req, res, next) => {
    const news = await News.findByPk(req.params.id)
    if (!news) return next(new ErrorResponse('Yangilik topilmadi', 404))
    if (!req.file) return next(new ErrorResponse('Rasm tanlang', 400))

    if (news.image?.publicId) await deleteFromCloudinary(news.image.publicId)
    const result = await uploadToCloudinary(req.file.buffer, 'news', {
        transformation: [{ width: 1200, height: 630, crop: 'limit', quality: 'auto' }],
    })
    await news.update({ image: result })
    res.status(200).json({ success: true, data: news })
})

exports.deleteImage = asyncHandler(async (req, res, next) => {
    const news = await News.findByPk(req.params.id)
    if (!news) return next(new ErrorResponse('Yangilik topilmadi', 404))
    if (news.image?.publicId) await deleteFromCloudinary(news.image.publicId)

    news.image = null
    news.changed('image', true)
    await news.save()
    await news.reload()

    res.status(200).json({ success: true, message: "Rasm o'chirildi", data: news })
})
