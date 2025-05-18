const jwt = require('jsonwebtoken')
const User = require('../models/account')

const admin = async (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1]

	if (!token) {
		return res
			.status(401)
			.json({ error: 'Access denied. No token provided.' })
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey')
		const user = await User.findById(decoded.id).select('-password')

		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		if (!user.is_admin) {
			return res
				.status(403)
				.json({ error: 'Access denied. Admin privileges required.' })
		}

		req.user = user
		next()
	} catch (error) {
		console.error('Admin middleware error:', error)
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({ error: 'Invalid token' })
		}
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ error: 'Token expired' })
		}
		res.status(500).json({ error: 'Internal server error' })
	}
}

const protect = async (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1]

	if (!token) {
		return res
			.status(401)
			.json({ error: 'Access denied. No token provided.' })
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey')
		const user = await User.findById(decoded.id).select('-password')

		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		req.user = user
		next()
	} catch (error) {
		console.error('Protect middleware error:', error)
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({ error: 'Invalid token' })
		}
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ error: 'Token expired' })
		}
		res.status(500).json({ error: 'Internal server error' })
	}
}

module.exports = {
	admin,
	protect,
}
