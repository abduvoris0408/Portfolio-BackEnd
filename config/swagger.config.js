const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Portfolio API Documentation',
			version: '2.0.0',
			description: "Professional Portfolio Backend API - To'liq hujjat",
			contact: {
				name: 'Abduvoris',
				email: 'your-email@example.com',
			},
		},
		servers: [
			{
				url: 'http://localhost:5000',
				description: 'Development server',
			},
			{
				url: 'https://your-production-url.com',
				description: 'Production server',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
			schemas: {
				Project: {
					type: 'object',
					required: ['title', 'description', 'category'],
					properties: {
						_id: {
							type: 'string',
							description: 'MongoDB ID',
						},
						title: {
							type: 'string',
							description: 'Loyiha nomi',
							maxLength: 100,
							example: 'E-commerce Website',
						},
						description: {
							type: 'string',
							description: 'Loyiha tavsifi',
							maxLength: 2000,
							example:
								'Full-stack e-commerce website with React and Node.js',
						},
						image: {
							type: 'string',
							description: 'Loyiha rasmi URL',
							example: 'https://cloudinary.com/image.jpg',
						},
						technologies: {
							type: 'array',
							items: {
								type: 'string',
							},
							description: 'Ishlatilgan texnologiyalar',
							example: ['React', 'Node.js', 'MongoDB'],
						},
						liveUrl: {
							type: 'string',
							description: 'Jonli loyiha URL',
							example: 'https://example.com',
						},
						githubUrl: {
							type: 'string',
							description: 'GitHub repository URL',
							example: 'https://github.com/user/repo',
						},
						category: {
							type: 'string',
							description: 'Kategoriya ID',
						},
						user: {
							type: 'string',
							description: 'Yaratuvchi user ID',
						},
						status: {
							type: 'string',
							enum: ['draft', 'published', 'archived'],
							default: 'published',
						},
						featured: {
							type: 'boolean',
							default: false,
						},
						views: {
							type: 'number',
							default: 0,
						},
						createdAt: {
							type: 'string',
							format: 'date-time',
						},
						updatedAt: {
							type: 'string',
							format: 'date-time',
						},
					},
				},
				User: {
					type: 'object',
					required: ['name', 'email', 'password'],
					properties: {
						_id: {
							type: 'string',
						},
						name: {
							type: 'string',
							minLength: 2,
							maxLength: 50,
							example: 'John Doe',
						},
						email: {
							type: 'string',
							format: 'email',
							example: 'john@example.com',
						},
						password: {
							type: 'string',
							minLength: 6,
							example: 'password123',
						},
						role: {
							type: 'string',
							enum: ['user', 'admin'],
							default: 'user',
						},
						avatar: {
							type: 'string',
							default: 'default-avatar.jpg',
						},
						bio: {
							type: 'string',
							maxLength: 500,
						},
						createdAt: {
							type: 'string',
							format: 'date-time',
						},
					},
				},
				Category: {
					type: 'object',
					required: ['name'],
					properties: {
						_id: {
							type: 'string',
						},
						name: {
							type: 'string',
							example: 'Web Development',
						},
						slug: {
							type: 'string',
							example: 'web-development',
						},
						description: {
							type: 'string',
						},
					},
				},
				Skill: {
					type: 'object',
					required: ['name', 'level'],
					properties: {
						_id: {
							type: 'string',
						},
						name: {
							type: 'string',
							example: 'JavaScript',
						},
						level: {
							type: 'number',
							minimum: 0,
							maximum: 100,
							example: 85,
						},
						category: {
							type: 'string',
							example: 'Frontend',
						},
						icon: {
							type: 'string',
						},
					},
				},
				Error: {
					type: 'object',
					properties: {
						success: {
							type: 'boolean',
							example: false,
						},
						message: {
							type: 'string',
							example: 'Error message',
						},
					},
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: ['./routes/*.js', './controllers/*.js'], // API yo'llari
}

const swaggerSpec = swaggerJsdoc(options)

const swaggerDocs = app => {
	// Swagger UI
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

	// JSON format
	app.get('/api-docs.json', (req, res) => {
		res.setHeader('Content-Type', 'application/json')
		res.send(swaggerSpec)
	})

	console.log('📚 Swagger Documentation: http://localhost:5000/api-docs')
}

module.exports = swaggerDocs
