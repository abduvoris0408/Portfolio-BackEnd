// JWT token va cookie bilan ishlash
const sendTokenResponse = (user, statusCode, res) => {
	// Token yaratish
	const token = user.getSignedJwtToken()

	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
		),
		httpOnly: true,
	}

	// HTTPS bo'lsa secure qilish
	if (process.env.NODE_ENV === 'production') {
		options.secure = true
	}

	res.status(statusCode)
		.cookie('token', token, options)
		.json({
			success: true,
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		})
}

module.exports = sendTokenResponse
