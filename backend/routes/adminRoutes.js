const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Product = require('../models/product')
const User = require('../models/account')

const router = express.Router()

async function getLowStockProductCount() {
	const lowStockCount = await Product.countDocuments({
		stock: { $lte: 4 }, // Consider products with 10 or fewer items as low stock
	})
	return lowStockCount
}

async function getCategoriesWithCount() {
	const categoryData = await Product.aggregate([
		{
			$group: {
				_id: '$category',
				value: { $count: {} },
			},
		},
	])

	return categoryData.map((category) => ({
		label: category._id,
		value: category.value,
	}))
}

async function getStockData() {
	const stockData = await Product.aggregate([
		{
			$group: {
				_id: '$category',
				totalStock: { $sum: '$stock' },
			},
		},
	])

	// Convert to a simple array of numbers
	const stockMap = stockData.reduce((acc, item) => {
		acc[item._id] = item.totalStock
		return acc
	}, {})

	const categories = await Product.distinct('category')

	// Ensure stockData aligns with stockLabels
	return categories.map((category) => stockMap[category] || 0)
}

router.get('/dashboard', async (req, res) => {
	try {
		const dashboardData = {
			totalProducts: await Product.countDocuments(),
			totalUsers: await User.find({ is_admin: false }).countDocuments(),
			totalOrders: 50,
			totalRevenue: 10000,
			categoriesWithCount: await getCategoriesWithCount(),
			stockLabels: await Product.distinct('category'),
			stockData: await getStockData(),
			lowStockProducts: await getLowStockProductCount(),
		}

		res.json(dashboardData)
	} catch (error) {
		console.error('Error fetching dashboard data:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
})

module.exports = router
