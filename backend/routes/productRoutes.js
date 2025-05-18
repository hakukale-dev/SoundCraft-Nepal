const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const upload = require('../middleware/uploadMiddleware')
const { cloudinary } = require('../config/cloudinary')
const { admin } = require('../middleware/authMiddleware')

router.get('/', async (req, res) => {
	try {
		const products = await Product.find({ stock: { $gt: 0 } })
		res.json(products)
	} catch (error) {
		res.status(500).json({ message: 'Server Error' })
	}
})

router.get('/:id', async (req, res) => {
	try {
		const product = await Product.findById(req.params.id).populate({
			path: 'reviews.user',
			select: 'first_name last_name photo',
			options: { strictPopulate: false },
		})

		if (!product) {
			return res.status(404).json({
				success: false,
				message: 'Product not found',
				code: 'PRODUCT_NOT_FOUND',
			})
		}

		const reviews = product.reviews || []
		const totalRating = reviews.reduce(
			(sum, review) => sum + (review?.rating || 0),
			0
		)
		const averageRating =
			reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0

		const productWithStats = {
			...product.toObject(),
			totalReviews: reviews.length,
			averageRating: Number(averageRating),
			isInStock: (product.stock || 0) > 0,
			hasDiscount: (product.price || 0) < 100,
			categoryLabel: product.category?.replace(' Instruments', '') || '',
		}

		res.json(productWithStats)
	} catch (error) {
		console.error('Error fetching product:', error)
		res.status(500).json({
			success: false,
			message: 'Internal Server Error',
			error:
				process.env.NODE_ENV === 'development'
					? {
							message: error.message,
							stack: error.stack,
					  }
					: undefined,
			code: 'SERVER_ERROR',
		})
	}
})

router.get('/:id/recommendation', async (req, res) => {
	try {
		const product = await Product.findById(req.params.id)
		if (!product) {
			return res.status(404).json({ message: 'Product not found' })
		}

		const recommendedProducts = await Product.aggregate([
			{
				$match: {
					category: product.category,
					_id: { $ne: product._id },
					stock: { $gt: 0 },
				},
			},
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

router.post('/', admin, upload.single('image'), async (req, res) => {
	try {
		const { name, model, description, price, category, stock } = req.body
		let imageUrl

		if (req.file) {
			const result = await cloudinary.uploader.upload(req.file.path)
			imageUrl = result.secure_url
		}

		const product = new Product({
			name,
			model,
			description,
			price,
			category,
			stock,
			image: imageUrl,
			sku: require('uuid').v4(),
		})

		const createdProduct = await product.save()
		res.status(201).json(createdProduct)
	} catch (error) {
		console.error(error)
		res.status(400).json({ message: error.message })
	}
})

router.put('/:id', admin, upload.single('image'), async (req, res) => {
	try {
		const product = await Product.findById(req.params.id)

		if (product) {
			product.name = req.body.name || product.name
			product.model = req.body.model || product.model
			product.description = req.body.description || product.description
			product.price = req.body.price || product.price
			product.category = req.body.category || product.category
			product.stock =
				req.body.stock !== undefined ? req.body.stock : product.stock

			if (req.file) {
				const result = await cloudinary.uploader.upload(req.file.path)

				if (product.image) {
					const publicId = product.image
						.split('/')
						.pop()
						.split('.')[0]
					await cloudinary.uploader.destroy(publicId)
				}

				product.image = result.secure_url
			}

			const updatedProduct = await product.save()
			res.json(updatedProduct)
		} else {
			res.status(404).json({ message: 'Product not found' })
		}
	} catch (error) {
		res.status(400).json({ message: 'Invalid product data' })
	}
})

router.delete('/:id', admin, async (req, res) => {
	try {
		const product = await Product.findById(req.params.id)

		if (product) {
			if (product.image) {
				const publicId = product.image.split('/').pop().split('.')[0]
				await cloudinary.uploader.destroy(publicId)
			}
			await Product.findByIdAndDelete(req.params.id)
			res.json({ message: 'Product removed' })
		} else {
			res.status(404).json({ message: 'Product not found' })
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Server Error' })
	}
})

router.get('/search', async (req, res) => {
	try {
		const { category, model, minPrice, maxPrice } = req.query

		const query = {}
		if (category) query.category = category
		if (model) query.model = model
		if (minPrice || maxPrice) {
			query.price = {}
			if (minPrice) query.price.$gte = Number(minPrice)
			if (maxPrice) query.price.$lte = Number(maxPrice)
		}

		const products = await Product.find(query)
		res.json(products)
	} catch (error) {
		res.status(500).json({ message: 'Server Error' })
	}
})

module.exports = router
