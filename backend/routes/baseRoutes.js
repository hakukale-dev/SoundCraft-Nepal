const express = require('express')
const Product = require('../models/product')
const { v4: uuidv4 } = require('uuid')
const generateSignature = require('../utils/utils')
const BillingHistory = require('../models/billing_history')
const axios = require('axios')

const router = express.Router()

router.get('/', (req, res) => {
	res.send('Hello World')
})

router.get('/recommendations', async (req, res) => {
	try {
		const recommendedProducts = await Product.aggregate([
			{ $match: { stock: { $gt: 0 } } },
			{ $sample: { size: 3 } },
			{
				$project: {
					equipment_id: '$_id',
					name: 1,
					thumbnail: '$image',
					price_per: '$price',
					_id: 0,
				},
			},
		])

		res.json(recommendedProducts)
	} catch (error) {
		res.status(500).json({ message: 'Server Error' })
	}
})

// Updated billing history route with completed filter
router.get('/billing-history', async (req, res) => {
	try {
		const billingHistory = await BillingHistory.find({
			user_id: req.user._id,
			status: 'completed', // Added status filter
		})
			.populate('items.product_id', 'name price')
			.sort({ created_at: -1 })
		res.json(billingHistory)
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving billing history' })
	}
})

router.post('/pay-esewa', async (req, res) => {
	try {
		const { items } = req.body
		const uuid = uuidv4()
		const total_amount = items
			.reduce((sum, item) => sum + item.qty * item.price_per, 0)
			.toFixed(2)
		const product_code = 'EPAYTEST'
		const field_names = 'total_amount,transaction_uuid,product_code'

		// Create billing history entry
		const billingHistoryEntry = new BillingHistory({
			user_id: req.user._id,
			payment_method: 'esewa',
			amount: total_amount,
			status: 'pending',
			items: items.map((item) => ({
				product_id: item.id,
				quantity: item.qty,
				price_per: item.price_per,
			})),
			payment_reference_id: uuid,
		})
		await billingHistoryEntry.save()

		const msg = `total_amount=${total_amount},transaction_uuid=${uuid},product_code=${product_code}`
		const signature = generateSignature(msg)

		res.json({
			formData: {
				amount: total_amount,
				failure_url: 'http://localhost:5173/payment-failure',
				product_delivery_charge: '0',
				product_service_charge: '0',
				product_code,
				signature,
				signed_field_names: field_names,
				success_url: 'http://localhost:8080/api/verify-esewa',
				tax_amount: '0',
				total_amount,
				transaction_uuid: uuid,
			},
		})
	} catch (error) {
		const statusCode = error.response?.status || 500
		const errorMessage =
			error.response?.data?.error_message || error.message

		res.status(statusCode).json({
			message: 'Payment processing failed',
			error: errorMessage,
			code: error.response?.data?.code || statusCode,
		})
	}
})

router.get('/verify-esewa', async (req, res) => {
	try {
		const { data } = req.query
		const decoded_data = Buffer.from(data, 'base64').toString('utf-8')
		const json_data = JSON.parse(decoded_data)

		// Get billing history entry by payment reference ID
		const billingHistoryEntry = await BillingHistory.findOne({
			payment_reference_id: json_data.transaction_uuid,
		})

		// Update product stock for each item in the order
		for (const item of billingHistoryEntry.items) {
			const product = await Product.findById(item.product_id)
			if (product) {
				product.stock = Math.max(0, product.stock - item.quantity)
				await product.save()
			}
		}

		// Update billing history status to completed
		billingHistoryEntry.status = 'completed'
		await billingHistoryEntry.save()

		res.redirect(
			`http://localhost:5173/payment-success?transaction_code=${json_data.transaction_code}&total_amount=${json_data.total_amount}&transaction_uuid=${json_data.transaction_uuid}`
		)
	} catch (error) {
		if (error instanceof SyntaxError) {
			console.log({ message: 'Invalid data format' })
			res.redirect(`http://localhost:5173/payment-failure`)
		} else {
			console.log({
				message: 'Verification failed',
				error: error.message,
			})
			res.redirect(`http://localhost:5173/payment-failure`)
		}
	}
})

router.post('/pay-khalti', async (req, res) => {
	try {
		const { items } = req.body
		const uuid = uuidv4()
		const total_amount = items
			.reduce((sum, item) => sum + item.qty * item.price_per, 0)
			.toFixed(2)

		// Create billing history entry
		const billingHistoryEntry = new BillingHistory({
			user_id: req.user._id,
			payment_method: 'khalti',
			amount: total_amount,
			status: 'pending',
			items: items.map((item) => ({
				product_id: item.id,
				quantity: item.qty,
				price_per: item.price_per,
			})),
			payment_reference_id: uuid,
		})
		await billingHistoryEntry.save()

		const payload = {
			return_url: 'http://localhost:8080/api/verify-khalti',
			website_url: 'http://localhost:5173/',
			amount: total_amount * 100,
			purchase_order_id: uuid,
			purchase_order_name: uuid,
			customer_info: {
				name: `${req.user.first_name} ${req.user.last_name}`,
				email: req.user.email,
				phone: req.user.phone_number,
			},
			product_details: await Promise.all(
				items.map(async (item) => ({
					identity: item.id,
					name: (await Product.findById(item.id)).name,
					total_price: item.qty * item.price_per * 100,
					quantity: item.qty,
					unit_price: item.price_per * 100,
				}))
			),
		}
		const instance = axios.create({
			headers: {
				Authorization: 'Key eeccc53572fa45bc92d2b393d8447b2e',
			},
		})
		const data = await instance
			.post('https://dev.khalti.com/api/v2/epayment/initiate/', payload)
			.then((res) => res.data)

		res.send(data?.payment_url)
	} catch (error) {
		const statusCode = error.response?.status || 500
		const errorMessage =
			error.response?.data?.error_message || error.message

		console.log(error)
		res.status(statusCode).json({
			message: 'Payment processing failed',
			error: errorMessage,
			code: error.response?.data?.code || statusCode,
		})
	}
})

router.get('/verify-khalti', async (req, res) => {
	try {
		const {
			pidx,
			transaction_id,
			tidx,
			amount,
			total_amount,
			mobile,
			status,
			purchase_order_id,
			purchase_order_name,
		} = req.query

		// Verify payment with Khalti API
		const instance = axios.create({
			headers: {
				Authorization: 'Key eeccc53572fa45bc92d2b393d8447b2e',
			},
		})

		const verification = await instance.post(
			`https://dev.khalti.com/api/v2/epayment/lookup/`,
			{
				pidx: pidx,
			}
		)

		if (verification.data.status !== 'Completed') {
			return res.status(400).json({
				message: 'Payment verification failed',
				error: 'Invalid transaction status',
			})
		}

		// Get billing history entry by payment reference ID
		const billingHistoryEntry = await BillingHistory.findOne({
			payment_reference_id: purchase_order_id,
		})

		// Update product stock for each item in the order
		for (const item of billingHistoryEntry.items) {
			const product = await Product.findById(item.product_id)
			if (product) {
				product.stock = Math.max(0, product.stock - item.quantity)
				await product.save()
			}
		}

		// Update billing history status to completed
		billingHistoryEntry.status = 'completed'
		await billingHistoryEntry.save()

		// Redirect to frontend success page
		res.redirect(
			`http://localhost:5173/payment-success?transaction_code=${transaction_id}&total_amount=${total_amount}&transaction_uuid=${tidx}`
		)
	} catch (error) {
		console.log(error)
	}
})

module.exports = router
