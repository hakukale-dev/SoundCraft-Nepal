const express = require('express')
const User = require('../models/account')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const upload = require('../middleware/uploadMiddleware')
const { cloudinary } = require('../config/cloudinary')
const { protect, admin } = require('../middleware/authMiddleware')

const router = express.Router()

// Create User (Admin only)
router.post('/user', admin, async (req, res) => {
	try {
		const {
			first_name,
			last_name,
			username,
			email,
			password,
			phone_number,
			address,
			dob,
			is_admin,
		} = req.body

		// Check if user already exists
		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		})
		if (existingUser) {
			return res.status(400).json({ error: 'User already exists' })
		}

		// Validate phone number format and check if already exists
		if (phone_number) {
			const existingPhone = await User.findOne({ phone_number })
			if (existingPhone) {
				return res.status(400).json({
					error: 'Phone number already in use',
				})
			}
		}

		// Validate password
		if (password.length < 8) {
			return res.status(400).json({
				error: 'Password must be at least 8 characters long',
			})
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 12)

		// Create new user
		const newUser = new User({
			first_name,
			last_name,
			username,
			email,
			password: hashedPassword,
			phone_number,
			address,
			dob,
			is_admin,
		})

		await newUser.save()

		// Return user without password
		const user = await User.findById(newUser._id).select('-password -__v')
		res.status(201).json(user)
	} catch (err) {
		console.error('Create user error:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Get User Details Route
router.get('/user', protect, async (req, res) => {
	try {
		// Get user ID from request (added by protect middleware)
		const userId = req.user._id

		// Find user and exclude sensitive fields
		const user = await User.findById(userId)
			.select('-password -__v -is_admin -is_disabled')
			.lean()

		if (!user) {
			return res.status(404).json({
				success: false,
				error: 'User not found',
			})
		}

		res.json({
			success: true,
			data: user,
		})
	} catch (err) {
		console.error('User details error:', err)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
			...(process.env.NODE_ENV === 'development' && {
				details: err.message,
			}),
		})
	}
})

// Get All Users (Admin only)
router.get('/users', admin, async (req, res) => {
	try {
		const users = await User.find().select('-password -__v').lean()
		res.json(users)
	} catch (err) {
		console.error('Get users error:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Update User
router.patch('/user/:id', protect, async (req, res) => {
	try {
		const { first_name, last_name, phone_number, address, dob } = req.body

		const userId = req.params.id

		if (!userId) {
			return res.status(400).json({ error: 'User ID is required' })
		}
		const user = await User.findById(userId)

		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		user.first_name = first_name || user.first_name
		user.last_name = last_name || user.last_name
		user.phone_number = phone_number || user.phone_number
		user.address = address || user.address
		user.dob = dob || user.dob
		user.updatedAt = new Date()

		const updatedUser = await user.save()

		res.json(user)
	} catch (err) {
		console.error('Update user error:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Update User Photo
router.patch(
	'/user/:id/photo',
	protect,
	upload.single('photo'),
	async (req, res) => {
		try {
			const userId = req.params.id

			if (!userId) {
				return res.status(400).json({ error: 'User ID is required' })
			}

			if (!req.file) {
				return res.status(400).json({ error: 'No photo uploaded' })
			}

			const result = await cloudinary.uploader.upload(req.file.path)
			const imageUrl = result.secure_url

			const user = await User.findById(userId)
			if (!user) {
				return res.status(404).json({ error: 'User not found' })
			}

			user.photo = imageUrl
			user.updatedAt = new Date()
			const updatedUser = await user.save()

			res.json({
				message: 'Photo updated successfully',
				photo: updatedUser.photo,
			})
		} catch (err) {
			console.error('Update photo error:', err)
			res.status(500).json({ error: 'Internal server error' })
		}
	}
)

// Delete User
router.delete('/user/:id', protect, async (req, res) => {
	try {
		const userId = req.params.id
		const requestingUser = req.user

		// Check if requesting user is admin or owns the account
		if (
			!requestingUser.is_admin &&
			requestingUser._id.toString() !== userId
		) {
			return res
				.status(403)
				.json({ error: 'Not authorized to delete this account' })
		}

		const user = await User.findById(userId)
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		// Remove all user references
		user.first_name = '[deleted]'
		user.last_name = '[deleted]'
		user.username = `deleted_${Date.now()}`
		user.email = `deleted_${Date.now()}@example.com`
		user.password = ''
		user.address = {}
		user.phone_number = ''
		user.dob = null
		user.photo = null
		user.is_disabled = true

		await user.save()

		res.json({ message: 'User data removed successfully' })
	} catch (err) {
		console.error('Delete user error:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Change Password
router.put('/user/:id/change-password', protect, async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body

		const user = await User.findById(req.params.id)
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		// Validate current password
		const isPasswordValid = await bcrypt.compare(
			currentPassword,
			user.password
		)
		if (!isPasswordValid) {
			return res
				.status(401)
				.json({ error: 'Current password is incorrect' })
		}

		// Validate new password
		if (newPassword.length < 8) {
			return res.status(400).json({
				error: 'New password must be at least 8 characters long',
			})
		}

		// Hash and update password
		const hashedPassword = await bcrypt.hash(newPassword, 12)
		user.password = hashedPassword
		user.updatedAt = new Date()
		await user.save()

		res.json({ message: 'Password updated successfully' })
	} catch (err) {
		console.error('Change password error:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Disable Account
router.put('/user/:id/disable', admin, async (req, res) => {
	try {
		const user = await User.findById(req.params.id)
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		// Check if user is already disabled
		if (user.is_disabled) {
			return res
				.status(400)
				.json({ error: 'Account is already disabled' })
		}

		// Disable the account
		user.is_disabled = true
		user.updatedAt = new Date()
		await user.save()

		res.json({ message: 'Account disabled successfully' })
	} catch (err) {
		console.error('Disable account error:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Enable Account
router.put('/user/:id/enable', admin, async (req, res) => {
	try {
		const user = await User.findById(req.params.id)
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		// Check if user is already enabled
		if (!user.is_disabled) {
			return res.status(400).json({ error: 'Account is already enabled' })
		}

		// Enable the account
		user.is_disabled = false
		user.updatedAt = new Date()
		await user.save()

		res.json({ message: 'Account enabled successfully' })
	} catch (err) {
		console.error('Enable account error:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

module.exports = router
