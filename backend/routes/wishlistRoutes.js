const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const Wishlist = require('../models/wishlist')
const Product = require('../models/product')

// Get user's wishlist
router.get('/', protect, async (req, res) => {
	try {
		const wishlist = await Wishlist.findOne({
			user: req.user._id,
		}).populate('products')
		if (!wishlist) {
			return res.status(200).json({ products: [] })
		}
		res.status(200).json(wishlist)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Server error' })
	}
})

// Add product to wishlist
router.post('/:productId', protect, async (req, res) => {
	try {
		const product = await Product.findById(req.params.productId)
		if (!product) {
			return res.status(404).json({ message: 'Product not found' })
		}

		let wishlist = await Wishlist.findOne({ user: req.user._id })

		if (!wishlist) {
			wishlist = new Wishlist({
				user: req.user._id,
				products: [req.params.productId],
			})
		} else {
			if (wishlist.products.includes(req.params.productId)) {
				return res
					.status(400)
					.json({ message: 'Product already in wishlist' })
			}
			wishlist.products.push(req.params.productId)
		}

		await wishlist.save()
		res.status(200).json(wishlist)
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
})

// Remove product from wishlist
router.delete('/:productId', protect, async (req, res) => {
	try {
		const wishlist = await Wishlist.findOne({ user: req.user._id })
		if (!wishlist) {
			return res.status(404).json({ message: 'Wishlist not found' })
		}

		const productIndex = wishlist.products.indexOf(req.params.productId)
		if (productIndex === -1) {
			return res.status(404).json({ message: 'Product not in wishlist' })
		}

		wishlist.products.splice(productIndex, 1)
		await wishlist.save()
		res.status(200).json(wishlist)
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
})

module.exports = router
