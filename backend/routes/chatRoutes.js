const express = require('express')
const router = express.Router()
const Chat = require('../models/chat')
const { protect } = require('../middleware/authMiddleware')

// Get all messages for a user
router.get('/', protect, async (req, res) => {
	try {
		const messages = await Chat.find({
			$or: [
				{ sender: req.user._id },
				{ receiver: req.user._id },
				{ isSupport: true },
			],
		})
			.populate('sender', 'first_name last_name photo')
			.populate('receiver', 'first_name last_name photo')
			.sort({ createdAt: 1 })

		res.json(messages)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

// Send a new message
router.post('/', protect, async (req, res) => {
	try {
		const { message, receiver, isSupport } = req.body

		if (!req.user.is_admin && !isSupport) {
			const adminUsers = await User.find({ is_admin: true })
			if (adminUsers.length === 0) {
				return res
					.status(400)
					.json({ message: 'No admin users available' })
			}
			receiver = adminUsers[0]._id
		}

		const newMessage = new Chat({
			sender: req.user._id,
			receiver,
			message,
			isSupport: isSupport || false,
		})

		const savedMessage = await newMessage.save()
		const populatedMessage = await Chat.findById(savedMessage._id)
			.populate('sender', 'first_name last_name photo')
			.populate('receiver', 'first_name last_name photo')

		res.status(201).json(populatedMessage)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

// Mark messages as read
router.put('/mark-read', protect, async (req, res) => {
	try {
		await Chat.updateMany(
			{
				receiver: req.user._id,
				isRead: false,
			},
			{
				$set: { isRead: true },
			}
		)

		res.json({ success: true })
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

module.exports = router
