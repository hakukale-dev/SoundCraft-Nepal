const express = require('express')
const User = require('../models/account')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const OTP = require('../models/otp')
const { sendEmail } = require('../utils/emailUtils')

const router = express.Router()

// Login Route
router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body

		// Find user by username
		const user = await User.findOne({ username })
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' })
		}

		// Check if account is disabled
		if (user.is_disabled) {
			return res
				.status(403)
				.json({ error: 'Account is disabled. Please contact support.' })
		}

		// Validate password
		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) {
			return res.status(401).json({ error: 'Invalid credentials' })
		}

		// Generate JWT
		const token = jwt.sign(
			{
				id: user._id,
				username: user.username,
				role: user.role || 'user',
			},
			process.env.JWT_SECRET || 'secretKey',
			{ expiresIn: '24h' }
		)

		// Return user data without sensitive information
		const userData = {
			_id: user._id,
			username: user.username,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			phone_number: user.phone_number,
			dob: user.dob,
			photo: user.photo,
			token: token,
			is_admin: user.is_admin,
		}

		res.json(userData)
	} catch (err) {
		console.error('Login error:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Register Route
router.post('/register', async (req, res) => {
	try {
		const {
			first_name,
			last_name,
			username,
			email,
			password,
			password2,
			phone_number,
			address,
			dob,
		} = req.body

		// Validate required fields
		if (
			!first_name ||
			!last_name ||
			!username ||
			!email ||
			!password ||
			!password2 ||
			!phone_number ||
			!address ||
			!dob
		) {
			return res
				.status(400)
				.json({ error: 'All required fields must be provided' })
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: 'Invalid email format' })
		}

		const allowedDomains = [
			'gmail.com',
			'yahoo.com',
			'outlook.com',
			'hotmail.com',
		]
		const domain = email.split('@')[1]
		if (!allowedDomains.includes(domain)) {
			return res.status(400).json({ error: 'Email domain not allowed' })
		}

		if (password !== password2) {
			return res.status(400).json({ error: 'Passwords do not match' })
		}

		if (password.length < 8) {
			return res
				.status(400)
				.json({ error: 'Password must be at least 8 characters long' })
		}

		// Check if email or username is already taken
		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		})
		if (existingUser) {
			if (existingUser.email === email) {
				return res
					.status(400)
					.json({ error: 'Email is already registered' })
			}
			return res.status(400).json({ error: 'Username is already taken' })
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 12)

		// Create and save user
		const newUser = new User({
			first_name,
			last_name,
			username,
			email,
			password: hashedPassword,
			phone_number,
			address,
			dob,
			role: 'user',
			createdAt: new Date(),
		})

		const savedUser = await newUser.save()

		// Return user data without password
		const userData = {
			id: savedUser._id,
			username: savedUser.username,
			first_name: savedUser.first_name,
			last_name: savedUser.last_name,
			email: savedUser.email,
			role: savedUser.role,
		}

		res.status(200).json({
			message: 'User registered successfully',
			user: userData,
		})
	} catch (err) {
		console.error('Registration error:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Create Admin Account Route (Protected)
router.post('/create-admin', async (req, res) => {
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
		} = req.body

		// Validate required fields
		if (
			!first_name ||
			!last_name ||
			!username ||
			!email ||
			!password ||
			!phone_number ||
			!address ||
			!dob
		) {
			return res
				.status(400)
				.json({ error: 'All required fields must be provided' })
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: 'Invalid email format' })
		}

		// Check if email or username is already taken
		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		})
		if (existingUser) {
			if (existingUser.email === email) {
				return res
					.status(400)
					.json({ error: 'Email is already registered' })
			}
			return res.status(400).json({ error: 'Username is already taken' })
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 12)

		// Create and save admin user
		const newAdmin = new User({
			first_name,
			last_name,
			username,
			email,
			password: hashedPassword,
			phone_number,
			address,
			dob,
			role: 'admin',
			is_admin: true,
			createdAt: new Date(),
		})

		const savedAdmin = await newAdmin.save()

		// Return admin data without password
		const adminData = {
			id: savedAdmin._id,
			username: savedAdmin.username,
			first_name: savedAdmin.first_name,
			last_name: savedAdmin.last_name,
			email: savedAdmin.email,
			role: savedAdmin.role,
		}

		res.status(200).json({
			message: 'Admin user created successfully',
			user: adminData,
		})
	} catch (err) {
		console.error('Admin creation error:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Verify Token Route
router.get('/verify-token', async (req, res) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		if (!token) {
			return res.status(401).json({ error: 'No token provided' })
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey')
		const user = await User.findById(decoded.id).select('-password')

		if (!user) {
			return res.status(401).json({ error: 'Invalid token' })
		}

		if (user.is_disabled) {
			return res
				.status(403)
				.json({ error: 'Account is disabled. Please contact support.' })
		}

		// Return user data without sensitive information
		const userData = {
			_id: user._id,
			username: user.username,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			phone_number: user.phone_number,
			dob: user.dob,
			photo: user.photo,
			is_admin: user.is_admin,
		}

		res.status(200).json(userData)
	} catch (err) {
		console.error('Token verification error:', err)
		if (err.name === 'TokenExpiredError') {
			return res.status(401).json({ error: 'Token expired' })
		}
		return res.status(401).json({ error: 'Invalid token' })
	}
})

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
	try {
		const { email } = req.body

		if (!email) {
			return res.status(400).json({ error: 'Email is required' })
		}

		const user = await User.findOne({ email })
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		// Generate reset token
		const resetToken = jwt.sign(
			{ id: user._id },
			process.env.JWT_SECRET || 'secretKey',
			{
				expiresIn: '15m',
			}
		)

		// Generate OTP
		const otp = Math.floor(100000 + Math.random() * 900000).toString()
		const salt = await bcrypt.genSalt(10)
		const hashedOTP = await bcrypt.hash(otp, salt)

		// Save OTP to database
		await OTP.findOneAndUpdate(
			{ email },
			{ otp: hashedOTP },
			{ upsert: true, new: true }
		)

		// Send email with OTP and reset link
		const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`
		await sendEmail({
			email: user.email,
			subject: 'Password Reset',
			html: `
                <p>You requested a password reset for your SoundCraft account.</p>
                <p>Your OTP is: <strong>${otp}</strong></p>
                <p>Or click this link to reset your password: <a href="${resetLink}">Reset Password</a></p>
                <p>This will expire in 15 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `,
		})

		res.status(200).json({ message: 'Reset instructions sent to email' })
	} catch (err) {
		console.error('Forgot password error:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Verify OTP/Token and Reset Password Route
router.post('/reset-password', async (req, res) => {
	try {
		const { email, otp, newPassword, token } = req.body

		if (!email || !newPassword || (!otp && !token)) {
			return res.status(400).json({
				error: 'Email, new password and either OTP or token are required',
			})
		}

		let isValid = false

		// Check if using token
		if (token) {
			try {
				const decoded = jwt.verify(
					token,
					process.env.JWT_SECRET || 'secretKey'
				)
				const user = await User.findById(decoded.id)
				if (user && user.email === email) {
					isValid = true
				}
			} catch (err) {
				console.error('Token verification error:', err)
			}
		}
		// Otherwise check OTP
		else if (otp) {
			const otpRecord = await OTP.findOne({ email })
			if (!otpRecord) {
				return res.status(400).json({ error: 'OTP expired or invalid' })
			}
			isValid = await otpRecord.compareOTP(otp)
		}

		if (!isValid) {
			return res.status(400).json({ error: 'Invalid verification' })
		}

		// Find user and update password
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		const salt = await bcrypt.genSalt(10)
		user.password = await bcrypt.hash(newPassword, salt)
		await user.save()

		// Delete OTP record
		await OTP.deleteOne({ email })

		res.status(200).json({ message: 'Password updated successfully' })
	} catch (err) {
		console.error('Reset password error:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

module.exports = router
