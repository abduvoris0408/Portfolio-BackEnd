const mongoose = require('mongoose')

const SkillSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Skill nomi kiritish majburiy'],
			trim: true,
			unique: true,
			maxlength: [50, 'Skill nomi 50 ta belgidan oshmasligi kerak'],
		},
		level: {
			type: String,
			enum: ['beginner', 'intermediate', 'advanced', 'expert'],
			default: 'intermediate',
		},
		percentage: {
			type: Number,
			min: [0, "Foiz 0 dan kam bo'lishi mumkin emas"],
			max: [100, 'Foiz 100 dan oshishi mumkin emas'],
			default: 50,
		},
		icon: {
			type: String,
			trim: true,
		},
		category: {
			type: String,
			enum: [
				'frontend',
				'backend',
				'database',
				'devops',
				'design',
				'other',
			],
			default: 'other',
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		order: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	},
)

// Index
SkillSchema.index({ user: 1, order: 1 })

module.exports = mongoose.model('Skill', SkillSchema)
