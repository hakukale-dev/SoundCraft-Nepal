const express = require('express')
const User = require('../models/account')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
			id: user._id,
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

module.exports = router
