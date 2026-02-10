const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')
const slugify = require('../utils/slugify')

const Project = sequelize.define('projects', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	title: {
		type: DataTypes.STRING(200),
		allowNull: false,
		validate: { notEmpty: { msg: 'Loyiha nomi kiritish majburiy' } },
	},
	slug: {
		type: DataTypes.STRING(250),
		unique: true,
	},
	shortDescription: {
		type: DataTypes.STRING(500),
		defaultValue: '',
		field: 'short_description',
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	image: {
		type: DataTypes.JSONB,
		defaultValue: null,
		comment: '{ url, publicId }',
	},
	gallery: {
		type: DataTypes.JSONB,
		defaultValue: [],
		comment: '[{ url, publicId }, ...]',
	},
	clientUrl: {
		type: DataTypes.STRING(500),
		defaultValue: '',
		field: 'client_url',
		comment: 'Mijoz saytiga havola',
	},
	categoryId: {
		type: DataTypes.UUID,
		field: 'category_id',
		references: { model: 'categories', key: 'id' },
	},
	status: {
		type: DataTypes.ENUM('published', 'draft', 'archived'),
		defaultValue: 'draft',
	},
	isFeatured: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		field: 'is_featured',
	},
	views: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
	order: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
	completedAt: {
		type: DataTypes.DATEONLY,
		field: 'completed_at',
	},
}, {
	tableName: 'projects',
	indexes: [
		{ fields: ['slug'] },
		{ fields: ['status'] },
		{ fields: ['category_id'] },
		{ fields: ['order'] },
	],
	hooks: {
		beforeValidate: (project) => {
			if (project.title && (project.isNewRecord || project.changed('title'))) {
				project.slug = slugify(project.title)
			}
		},
	},
})

module.exports = Project
