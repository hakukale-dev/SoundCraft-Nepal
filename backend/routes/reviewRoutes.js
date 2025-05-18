const express = require('express')
const router = express.Router()
const Review = require('../models/reviews')
const Product = require('../models/product')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, async (req, res) => {
	try {
		console.log(req.body)
		const { productId, rating, comment } = req.body

		if (!productId || !rating || !comment) {
			return res.status(400).json({
				success: false,
				message: 'Please provide all required fields',
				code: 'MISSING_FIELDS',
			})
		}

		const product = await Product.findById(productId)
		if (!product) {
			return res.status(404).json({
				success: false,
				message: 'Product not found',
				code: 'PRODUCT_NOT_FOUND',
			})
		}

		// Check if user already reviewed this product
		const existingReview = await Review.findOne({
			user: req.user._id,
			product: productId,
		})

		if (existingReview) {
			return res.status(400).json({
				success: false,
				message: 'You have already reviewed this product',
				code: 'DUPLICATE_REVIEW',
			})
		}

		const review = new Review({
			user: req.user._id,
			product: productId,
			rating,
			comment,
		})

		const createdReview = await review.save()

		if (!product.reviews) {
			product.reviews = []
		}

		product.reviews.push({
			user: req.user._id,
			rating,
			comment,
			createdAt: new Date(),
		})

		await product.save()

		res.status(201).json({
			success: true,
			data: createdReview,
		})
	} catch (error) {
		console.error('Error creating review:', error)
		res.status(500).json({
			success: false,
			message: 'Server Error',
			error:
				process.env.NODE_ENV === 'development'
					? error.message
					: undefined,
			code: 'SERVER_ERROR',
		})
	}
})

router.get('/product/:productId', async (req, res) => {
	try {
		const reviews = await Review.find({ product: req.params.productId })
			.populate('user', 'first_name last_name photo')
			.sort({ createdAt: -1 })

		res.json({
			success: true,
			data: reviews,
		})
	} catch (error) {
		console.error('Error fetching reviews:', error)
		res.status(500).json({
			success: false,
			message: 'Server Error',
			error:
				process.env.NODE_ENV === 'development'
					? error.message
					: undefined,
			code: 'SERVER_ERROR',
		})
	}
})

module.exports = router
