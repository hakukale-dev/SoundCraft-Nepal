const express = require('express')
const router = express.Router()
const ReachUs = require('../models/reachUs')

// Submit contact form
router.post('/', async (req, res) => {
	try {
		console.log(req.body)
		const { name, email, message } = req.body.data

		// Validate required fields
		if (!name || !email || !message) {
			return res.status(400).json({ error: 'All fields are required' })
		}

		// Create new contact form entry
		const contactForm = await ReachUs.create({
			name,
			email,
			message,
		})

		res.status(201).json(contactForm)
	} catch (err) {
		console.error('Error submitting contact form:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Get all contact form submissions (admin only)
router.get('/', async (req, res) => {
	try {
		const submissions = await ReachUs.find().sort({ createdAt: -1 })
		res.status(200).json(submissions)
	} catch (err) {
		console.error('Error fetching contact submissions:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Delete a contact form submission
router.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params
		const deletedSubmission = await ReachUs.findByIdAndDelete(id)

		if (!deletedSubmission) {
			return res.status(404).json({ error: 'Submission not found' })
		}

		res.status(200).json({ message: 'Submission deleted successfully' })
	} catch (err) {
		console.error('Error deleting contact submission:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

module.exports = router
