const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const { protect, admin } = require('../middleware/authMiddleware')

// Get all categories
router.get('/', async (req, res) => {
	try {
		const categories = await Category.find()
		res.json(categories)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

// Get one category
router.get('/:id', getCategory, (req, res) => {
	res.json(res.category)
})

// Create category - Admin only
router.post('/', protect, admin, async (req, res) => {
	const category = new Category({
		name: req.body.name,
		description: req.body.description,
		type: req.body.type,
	})

	try {
		const newCategory = await category.save()
		res.status(201).json(newCategory)
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

// Update category - Admin only
router.patch('/:id', protect, admin, getCategory, async (req, res) => {
	if (req.body.name != null) {
		res.category.name = req.body.name
	}
	if (req.body.description != null) {
		res.category.description = req.body.description
	}
	if (req.body.type != null) {
		res.category.type = req.body.type
	}

	try {
		const updatedCategory = await res.category.save()
		res.json(updatedCategory)
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

// Delete category - Admin only
router.delete('/:id', protect, admin, getCategory, async (req, res) => {
	try {
		await res.category.remove()
		res.json({ message: 'Deleted Category' })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

// Middleware to get category by ID
async function getCategory(req, res, next) {
	let category
	try {
		category = await Category.findById(req.params.id)
		if (category == null) {
			return res.status(404).json({ message: 'Cannot find category' })
		}
	} catch (err) {
		return res.status(500).json({ message: err.message })
	}

	res.category = category
	next()
}

module.exports = router
