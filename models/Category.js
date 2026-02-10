const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')
const slugify = require('../utils/slugify')

const Category = sequelize.define('categories', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING(100),
		allowNull: false,
		validate: { notEmpty: { msg: 'Kategoriya nomi kiritish majburiy' } },
	},
	slug: {
		type: DataTypes.STRING(120),
	},
	type: {
		type: DataTypes.ENUM('project', 'blog', 'service', 'skill', 'news'),
		allowNull: false,
		validate: { notEmpty: { msg: 'Kategoriya turi kiritish majburiy' } },
	},
	description: {
		type: DataTypes.TEXT,
		defaultValue: '',
	},
	icon: {
		type: DataTypes.STRING(100),
		defaultValue: '',
	},
	color: {
		type: DataTypes.STRING(20),
		defaultValue: '#3B82F6',
	},
	image: {
		type: DataTypes.JSONB,
		defaultValue: null,
		comment: '{ url, publicId }',
	},
	isActive: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
		field: 'is_active',
	},
}, {
	tableName: 'categories',
	indexes: [
		{ unique: true, fields: ['name', 'type'] },
		{ fields: ['slug'] },
		{ fields: ['type'] },
	],
	hooks: {
		beforeValidate: (category) => {
			if (category.name) {
				category.slug = slugify(category.name)
			}
		},
	},
})

module.exports = Category
