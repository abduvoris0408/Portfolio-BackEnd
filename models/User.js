const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Ism kiritish majburiy'],
			trim: true,
			minlength: [2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"],
			maxlength: [50, 'Ism 50 ta belgidan oshmasligi kerak'],
		},
		email: {
			type: String,
			required: [true, 'Email kiritish majburiy'],
			unique: true,
			lowercase: true,
			trim: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"Email formati noto'g'ri",
			],
		},
		password: {
			type: String,
			required: [true, 'Parol kiritish majburiy'],
			minlength: [6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"],
			select: false, // Password default ravishda qaytarilmaydi
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
		avatar: {
			type: String,
			default: 'default-avatar.jpg',
		},
		bio: {
			type: String,
			maxlength: [500, 'Bio 500 ta belgidan oshmasligi kerak'],
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
)

// Virtual - User'ning projectlari
UserSchema.virtual('projects', {
	ref: 'Project',
	localField: '_id',
	foreignField: 'user',
	justOne: false,
})

// Password hash qilish (save qilishdan oldin)
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next()
	}

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

// Parolni tekshirish
UserSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}

// JWT Token yaratish
UserSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	})
}

module.exports = mongoose.model('User', UserSchema)
