const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')

const Skill = sequelize.define('skills', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING(100),
		allowNull: false,
		validate: { notEmpty: { msg: 'Soha nomi kiritish majburiy' } },
	},
	level: {
		type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'expert'),
		defaultValue: 'intermediate',
	},
	percentage: {
		type: DataTypes.INTEGER,
		defaultValue: 50,
		validate: { min: 0, max: 100 },
	},
	icon: {
		type: DataTypes.STRING(100),
		defaultValue: '',
	},
	image: {
		type: DataTypes.JSONB,
		defaultValue: null,
		comment: '{ url, publicId }',
	},
	categoryId: {
		type: DataTypes.UUID,
		field: 'category_id',
		references: { model: 'categories', key: 'id' },
	},
	order: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
	isActive: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
		field: 'is_active',
	},
}, {
	tableName: 'skills',
	indexes: [
		{ fields: ['category_id'] },
		{ fields: ['order'] },
	],
})

module.exports = Skill
