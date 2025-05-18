const express = require('express')

const Product = require('../models/product')
const User = require('../models/account')
const BillingHistory = require('../models/billing_history')
const LearningHub = require('../models/lesson')
const Review = require('../models/reviews')
const { admin } = require('../middleware/authMiddleware')

const router = express.Router()

async function getLowStockProductCount() {
	const lowStockCount = await Product.countDocuments({
		stock: { $lte: 4 },
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

	const stockMap = stockData.reduce((acc, item) => {
		acc[item._id] = item.totalStock
		return acc
	}, {})

	const categories = await Product.distinct('category')
	return categories.map((category) => stockMap[category] || 0)
}

async function getTotalRevenue() {
	const result = await BillingHistory.aggregate([
		{
			$match: { status: 'completed' },
		},
		{
			$group: {
				_id: null,
				total: { $sum: '$amount' },
			},
		},
	])
	return result.length > 0 ? result[0].total : 0
}

async function getTotalLessons() {
	return await LearningHub.countDocuments()
}

async function getAverageRating() {
	try {
		const reviews = await Review.find({})
		if (reviews.length === 0) return 0

		const totalRating = reviews.reduce(
			(sum, review) => sum + review.rating,
			0
		)
		const average = totalRating / reviews.length
		return average.toFixed(1)
	} catch (error) {
		console.error('Error calculating average rating:', error)
		return 0
	}
}

router.get('/dashboard', admin, async (req, res) => {
	try {
		const dashboardData = {
			totalProducts: await Product.countDocuments(),
			totalUsers: await User.countDocuments(),
			totalOrders: await BillingHistory.countDocuments(),
			totalRevenue: await getTotalRevenue(),
			totalLessons: await getTotalLessons(),
			averageRating: await getAverageRating(),
			categoriesWithCount: await getCategoriesWithCount(),
			stockLabels: await Product.distinct('category'),
			stockData: await getStockData(),
			lowStockProducts: await getLowStockProductCount(),
			recentOrders: await BillingHistory.find()
				.sort({ createdAt: -1 })
				.limit(5)
				.populate('user_id', 'first_name last_name email'),
			recentReviews: await Review.find()
				.sort({ createdAt: -1 })
				.limit(5)
				.populate('user', 'first_name last_name '),
			recentLessons: await LearningHub.find()
				.sort({ createdAt: -1 })
				.limit(5),
		}

		res.json(dashboardData)
	} catch (error) {
		console.error('Error fetching dashboard data:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
})

module.exports = router
