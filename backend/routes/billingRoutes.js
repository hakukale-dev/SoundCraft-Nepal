const express = require('express')
const BillingHistory = require('../models/billing_history')
const router = express.Router()

// Get all billing histories
router.get('/', async (req, res) => {
	try {
		const billingHistories = await BillingHistory.find()
			.populate('user_id')
			.populate('items.product_id')
		res.json(billingHistories)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

// Get billing history by ID
router.get('/:id', async (req, res) => {
	try {
		const billingHistory = await BillingHistory.findById(req.params.id)
			.populate('user_id')
			.populate('items.product_id')
		if (!billingHistory) {
			return res
				.status(404)
				.json({ message: 'Billing history not found' })
		}
		res.json(billingHistory)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

// Get billing histories by user ID
router.get('/user/:userId', async (req, res) => {
	try {
		const billingHistories = await BillingHistory.find({
			user_id: req.params.userId,
			'items.product_id': { $ne: null },
		})
			.populate('user_id')
			.populate('items.product_id')
		res.json(billingHistories)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

// Download invoice
router.get('/download/:id', async (req, res) => {
	try {
		const billingHistory = await BillingHistory.findById(req.params.id)
			.populate('user_id')
			.populate('items.product_id')

		if (!billingHistory) {
			return res
				.status(404)
				.json({ message: 'Billing history not found' })
		}

		// Generate invoice content
		const invoiceContent = `
			Invoice ID: ${billingHistory._id}
			Date: ${billingHistory.date}
			Customer: ${billingHistory.user_id.username}
			Items:
			${billingHistory.items
				.map(
					(item) => `
				- ${item.product_id.name}: ${item.quantity} x $${item.price} = $${
						item.quantity * item.price
					}
			`
				)
				.join('')}
			Total: $${billingHistory.total}
		`

		// Set headers for file download
		res.setHeader('Content-Type', 'text/plain')
		res.setHeader(
			'Content-Disposition',
			`attachment; filename=invoice_${billingHistory._id}.txt`
		)

		// Send the invoice content
		res.send(invoiceContent)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

module.exports = router
