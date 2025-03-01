const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const upload = require('../middleware/uploadMiddleware')
const { protect, admin } = require('../middleware/authMiddleware')

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
		console.log('/:id')
		const product = await Product.findById(req.params.id)
		if (product) {
			res.json(product)
		} else {
			res.status(404).json({ message: 'Product not found' })
		}
	} catch (error) {
		res.status(500).json({ message: 'Server Error' })
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

router.post('/', upload.single('image'), async (req, res) => {
	try {
		const { name, model, description, price, category, stock } = req.body

		let imageUrl
		if (req.file) {
			imageUrl = `${req.protocol}://${req.get('host')}/uploads/${
				req.file.filename
			}`
		}

		const product = new Product({
			name,
			model,
			description,
			price,
			category,
			stock,
			image: imageUrl,
		})

		const createdProduct = await product.save()
		res.status(201).json(createdProduct)
	} catch (error) {
		res.status(400).json({ message: error.message })
		console.log(error)
	}
})

router.put('/:id', upload.single('image'), async (req, res) => {
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
				product.image = `${req.protocol}://${req.get('host')}/uploads/${
					req.file.filename
				}`
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

router.delete('/:id', async (req, res) => {
	try {
		const product = await Product.findById(req.params.id)

		if (product) {
			await product.deleteOne()
			res.json({ message: 'Product removed' })
		} else {
			res.status(404).json({ message: 'Product not found' })
		}
	} catch (error) {
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
