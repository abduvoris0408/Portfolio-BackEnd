const { sequelize } = require('../config/db.config')

// ===== Modellar =====
const User = require('./User')
const About = require('./About')
const Category = require('./Category')
const Tag = require('./Tag')
const Project = require('./Project')
const Skill = require('./Skill')
const Service = require('./Service')
const ServiceDetail = require('./ServiceDetail')
const BlogPost = require('./BlogPost')
const BlogComment = require('./BlogComment')
const BlogRating = require('./BlogRating')
const News = require('./News')
const Experience = require('./Experience')
const Education = require('./Education')
const Contact = require('./Contact')
const Testimonial = require('./Testimonial')
const Faq = require('./Faq')
const Partner = require('./Partner')
const Consultation = require('./Consultation')
const Achievement = require('./Achievement')

// ===== Junction Tables =====
const BlogPostTag = sequelize.define('blog_post_tags', {}, { tableName: 'blog_post_tags', timestamps: false })
const NewsTag = sequelize.define('news_tags', {}, { tableName: 'news_tags', timestamps: false })

// ===== ASSOCIATIONS =====

// Category -> Project, Skill, Service, BlogPost, News, Faq
Category.hasMany(Project, { foreignKey: 'category_id', as: 'projects' })
Project.belongsTo(Category, { foreignKey: 'category_id', as: 'category' })

Category.hasMany(Skill, { foreignKey: 'category_id', as: 'skills' })
Skill.belongsTo(Category, { foreignKey: 'category_id', as: 'category' })

Category.hasMany(Service, { foreignKey: 'category_id', as: 'services' })
Service.belongsTo(Category, { foreignKey: 'category_id', as: 'category' })

Category.hasMany(BlogPost, { foreignKey: 'category_id', as: 'blogPosts' })
BlogPost.belongsTo(Category, { foreignKey: 'category_id', as: 'category' })

Category.hasMany(News, { foreignKey: 'category_id', as: 'news' })
News.belongsTo(Category, { foreignKey: 'category_id', as: 'category' })

Category.hasMany(Faq, { foreignKey: 'category_id', as: 'faqs' })
Faq.belongsTo(Category, { foreignKey: 'category_id', as: 'category' })

// Service -> ServiceDetail
Service.hasMany(ServiceDetail, { foreignKey: 'service_id', as: 'details', onDelete: 'CASCADE' })
ServiceDetail.belongsTo(Service, { foreignKey: 'service_id', as: 'service' })

// Service -> Consultation
Service.hasMany(Consultation, { foreignKey: 'service_id', as: 'consultations' })
Consultation.belongsTo(Service, { foreignKey: 'service_id', as: 'service' })

// BlogPost -> BlogComment (nested replies)
BlogPost.hasMany(BlogComment, { foreignKey: 'blog_post_id', as: 'comments', onDelete: 'CASCADE' })
BlogComment.belongsTo(BlogPost, { foreignKey: 'blog_post_id', as: 'blogPost' })
BlogComment.hasMany(BlogComment, { foreignKey: 'parent_comment_id', as: 'replies' })
BlogComment.belongsTo(BlogComment, { foreignKey: 'parent_comment_id', as: 'parentComment' })

// BlogPost -> BlogRating
BlogPost.hasMany(BlogRating, { foreignKey: 'blog_post_id', as: 'ratings', onDelete: 'CASCADE' })
BlogRating.belongsTo(BlogPost, { foreignKey: 'blog_post_id', as: 'blogPost' })

// Many-to-Many: BlogPost <-> Tag
BlogPost.belongsToMany(Tag, { through: BlogPostTag, foreignKey: 'blog_post_id', otherKey: 'tag_id', as: 'tags' })
Tag.belongsToMany(BlogPost, { through: BlogPostTag, foreignKey: 'tag_id', otherKey: 'blog_post_id', as: 'blogPosts' })

// Many-to-Many: News <-> Tag
News.belongsToMany(Tag, { through: NewsTag, foreignKey: 'news_id', otherKey: 'tag_id', as: 'tags' })
Tag.belongsToMany(News, { through: NewsTag, foreignKey: 'tag_id', otherKey: 'news_id', as: 'news' })

module.exports = {
    sequelize,
    User,
    About,
    Category,
    Tag,
    Project,
    Skill,
    Service,
    ServiceDetail,
    BlogPost,
    BlogComment,
    BlogRating,
    News,
    Experience,
    Education,
    Contact,
    Testimonial,
    Faq,
    Partner,
    Consultation,
    Achievement,
    BlogPostTag,
    NewsTag,
}
