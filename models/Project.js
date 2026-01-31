const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Loyiha nomi kiritish majburiy'],
			trim: true,
			maxlength: [100, 'Loyiha nomi 100 ta belgidan oshmasligi kerak'],
		},
		description: {
			type: String,
			required: [true, 'Tavsif kiritish majburiy'],
			maxlength: [2000, 'Tavsif 2000 ta belgidan oshmasligi kerak'],
		},
		image: {
			type: String,
			default: 'default-project.jpg',
		},
		technologies: [
			{
				type: String,
				trim: true,
			},
		],
		liveUrl: {
			type: String,
			trim: true,
		},
		githubUrl: {
			type: String,
			trim: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			required: [true, 'Kategoriya tanlash majburiy'],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		status: {
			type: String,
			enum: ['draft', 'published', 'archived'],
			default: 'published',
		},
		featured: {
			type: Boolean,
			default: false,
		},
		views: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
)

// Index (qidiruv tezligi uchun)
ProjectSchema.index({ title: 'text', description: 'text' })
ProjectSchema.index({ user: 1, createdAt: -1 })

module.exports = mongoose.model('Project', ProjectSchema)
