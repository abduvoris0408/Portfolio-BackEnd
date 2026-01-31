const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Kategoriya nomi kiritish majburiy'],
			trim: true,
			unique: true,
			maxlength: [50, 'Kategoriya nomi 50 ta belgidan oshmasligi kerak'],
		},
		slug: {
			type: String,
			unique: true,
			lowercase: true,
		},
		description: {
			type: String,
			maxlength: [500, 'Tavsif 500 ta belgidan oshmasligi kerak'],
		},
		icon: {
			type: String,
			trim: true,
		},
		color: {
			type: String,
			default: '#3B82F6',
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
)

// Slug yaratish (save qilishdan oldin)
CategorySchema.pre('save', function (next) {
	if (this.isModified('name')) {
		this.slug = this.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '')
	}
	next()
})

// Virtual - Kategoriyaning projectlari soni
CategorySchema.virtual('projectCount', {
	ref: 'Project',
	localField: '_id',
	foreignField: 'category',
	count: true,
})

module.exports = mongoose.model('Category', CategorySchema)
