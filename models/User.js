const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = sequelize.define('users', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING(100),
		allowNull: false,
		validate: {
			notEmpty: { msg: "Ism kiritish majburiy" },
			len: { args: [2, 100], msg: "Ism 2-100 belgi orasida bo'lishi kerak" },
		},
	},
	email: {
		type: DataTypes.STRING(100),
		allowNull: false,
		unique: { msg: "Bu email allaqachon ro'yxatdan o'tgan" },
		validate: {
			isEmail: { msg: "Email formati noto'g'ri" },
		},
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			len: { args: [6, 100], msg: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" },
		},
	},
	role: {
		type: DataTypes.ENUM('admin'),
		defaultValue: 'admin',
	},
	avatar: {
		type: DataTypes.JSONB,
		defaultValue: null,
		comment: '{ url, publicId }',
	},
	refreshToken: {
		type: DataTypes.TEXT,
		field: 'refresh_token',
	},
	loginAttempts: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		field: 'login_attempts',
	},
	lockUntil: {
		type: DataTypes.DATE,
		field: 'lock_until',
	},
	lastLogin: {
		type: DataTypes.DATE,
		field: 'last_login',
	},
}, {
	hooks: {
		beforeCreate: async (user) => {
			if (user.password) {
				const salt = await bcrypt.genSalt(12)
				user.password = await bcrypt.hash(user.password, salt)
			}
		},
		beforeUpdate: async (user) => {
			if (user.changed('password')) {
				const salt = await bcrypt.genSalt(12)
				user.password = await bcrypt.hash(user.password, salt)
			}
		},
	},
	defaultScope: {
		attributes: { exclude: ['password', 'refreshToken', 'loginAttempts', 'lockUntil'] },
	},
	scopes: {
		withPassword: { attributes: {} },
	},
})

// Instance methods
User.prototype.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}

User.prototype.getSignedJwtToken = function () {
	return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE || '1d',
	})
}

User.prototype.getRefreshToken = function () {
	return jwt.sign({ id: this.id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
	})
}

User.prototype.incrementLoginAttempts = async function () {
	const MAX_ATTEMPTS = 5
	const LOCK_TIME = 30 * 60 * 1000 // 30 daqiqa

	this.loginAttempts += 1
	if (this.loginAttempts >= MAX_ATTEMPTS) {
		this.lockUntil = new Date(Date.now() + LOCK_TIME)
	}
	await this.save()
}

User.prototype.resetLoginAttempts = async function () {
	this.loginAttempts = 0
	this.lockUntil = null
	this.lastLogin = new Date()
	await this.save()
}

// Virtual getter
Object.defineProperty(User.prototype, 'isLocked', {
	get() {
		return this.lockUntil && this.lockUntil > Date.now()
	},
})

module.exports = User
