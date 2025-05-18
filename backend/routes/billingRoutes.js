const express = require('express')
const BillingHistory = require('../models/billing_history')
const router = express.Router()
const { protect, admin } = require('../middleware/authMiddleware')

// Get all orders (admin only)
router.get('/admin', admin, async (req, res) => {
	try {
		const orders = await BillingHistory.find({})
			.populate({ path: 'user_id', select: 'first_name last_name' })
			.populate({
				path: 'items.product_id',
				select: 'name model sku description price category stock image createdAt updatedAt',
			})
			.sort({ createdAt: -1 })

		res.json(orders)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

// Get all billing histories
router.get('/', protect, async (req, res) => {
	try {
		let query = {}
		if (!req.user.is_admin) {
			query.user_id = req.user._id
		}
		const billingHistories = await BillingHistory.find(query)
			.populate('user_id')
			.populate('items.product_id')
		res.json(billingHistories)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

// Get billing history by ID
router.get('/:id', protect, async (req, res) => {
	try {
		const billingHistory = await BillingHistory.findById(req.params.id)
			.populate('user_id')
			.populate('items.product_id')

		if (!billingHistory) {
			return res
				.status(404)
				.json({ message: 'Billing history not found' })
		}

		if (
			!req.user.is_admin &&
			billingHistory.user_id._id.toString() !== req.user._id.toString()
		) {
			return res.status(403).json({
				message: 'Not authorized to access this billing history',
			})
		}

		res.json(billingHistory)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

// Get billing histories by user ID
router.get('/user/:userId', protect, async (req, res) => {
	try {
		if (
			req.params.userId !== req.user._id.toString() &&
			!req.user.is_admin
		) {
			return res.status(403).json({
				message: 'Not authorized to access these billing histories',
			})
		}

		const billingHistories = await BillingHistory.find({
			user_id: req.params.userId,
			'items.product_id': { $ne: null },
		})
			.sort({ date: -1 })
			.populate('user_id')
			.populate({
				path: 'items.product_id',
				select: 'name price image',
			})
		res.json(billingHistories)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

// Download invoice
router.get('/download/:id', protect, async (req, res) => {
	try {
		const billingHistory = await BillingHistory.findById(req.params.id)
			.populate('user_id')
			.populate('items.product_id')

		if (!billingHistory) {
			return res
				.status(404)
				.json({ message: 'Billing history not found' })
		}

		if (
			!req.user.is_admin &&
			billingHistory.user_id._id.toString() !== req.user._id.toString()
		) {
			return res
				.status(403)
				.json({ message: 'Not authorized to download this invoice' })
		}

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

		res.setHeader('Content-Type', 'text/plain')
		res.setHeader(
			'Content-Disposition',
			`attachment; filename=invoice_${billingHistory._id}.txt`
		)

		res.send(invoiceContent)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

module.exports = router
