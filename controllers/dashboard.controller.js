const asyncHandler = require('../utils/asyncHandler')
const {
    Project, BlogPost, News, Service, Skill,
    Contact, Experience, Education, Category, Tag, BlogComment,
    Testimonial, Faq, Partner, Consultation, Achievement,
} = require('../models')

// @desc    Dashboard statistikalar
// @route   GET /api/v1/dashboard
// @access  Private (Admin)
exports.getDashboard = asyncHandler(async (req, res, next) => {
    const [
        projectsCount, blogPostsCount, newsCount, servicesCount,
        skillsCount, contactsCount, experiencesCount, educationsCount,
        categoriesCount, tagsCount, unreadContacts, pendingComments,
        testimonialsCount, faqsCount, partnersCount,
        pendingConsultations, achievementsCount,
    ] = await Promise.all([
        Project.count(),
        BlogPost.count(),
        News.count(),
        Service.count(),
        Skill.count(),
        Contact.count(),
        Experience.count(),
        Education.count(),
        Category.count(),
        Tag.count(),
        Contact.count({ where: { isRead: false } }),
        BlogComment.count({ where: { status: 'pending' } }),
        Testimonial.count(),
        Faq.count(),
        Partner.count(),
        Consultation.count({ where: { status: 'pending' } }),
        Achievement.count(),
    ])

    const recentContacts = await Contact.findAll({
        order: [['created_at', 'DESC']],
        limit: 5,
    })

    const recentPosts = await BlogPost.findAll({
        order: [['created_at', 'DESC']],
        limit: 5,
        attributes: ['id', 'title', 'slug', 'status', 'views', 'createdAt'],
    })

    const recentConsultations = await Consultation.findAll({
        order: [['created_at', 'DESC']],
        limit: 5,
        include: [{ model: Service, as: 'service', attributes: ['id', 'title'] }],
    })

    const popularProjects = await Project.findAll({
        order: [['views', 'DESC']],
        limit: 5,
        attributes: ['id', 'title', 'slug', 'views', 'status'],
    })

    res.status(200).json({
        success: true,
        data: {
            counts: {
                projects: projectsCount,
                blogPosts: blogPostsCount,
                news: newsCount,
                services: servicesCount,
                skills: skillsCount,
                contacts: contactsCount,
                experiences: experiencesCount,
                education: educationsCount,
                categories: categoriesCount,
                tags: tagsCount,
                testimonials: testimonialsCount,
                faqs: faqsCount,
                partners: partnersCount,
                achievements: achievementsCount,
            },
            alerts: {
                unreadContacts,
                pendingComments,
                pendingConsultations,
            },
            recent: {
                contacts: recentContacts,
                posts: recentPosts,
                consultations: recentConsultations,
            },
            popular: {
                projects: popularProjects,
            },
        },
    })
})
