const express = require('express')
const app = express()
const path = require('path')
const dotenv = require('dotenv').config()

const cors = require('cors')
const mongo_uri = process.env.MONGODB_URI 
	

app.use(cors())
app.use(express.json())

console.log(process.env.EMAIL_USER)
const baseRoutes = require('./routes/baseRoutes')
const authRoutes = require('./routes/authRoutes')
const accountRoutes = require('./routes/accountRoutes')
const productRoutes = require('./routes/productRoutes')
const adminRoutes = require('./routes/adminRoutes')
const billingRoutes = require('./routes/billingRoutes')
const lessonsRoutes = require('./routes/lessonRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const wishlistRoutes = require('./routes/wishlistRoutes')
const chatRoutes = require('./routes/chatRoutes')
const reachUsRoutes = require('./routes/reachUsRoutes')
const categoryRoutes = require('./routes/categoryRoutes')

const mongoose = require('mongoose')
mongoose
	.connect(mongo_uri, {
		dbName: 'g-shop',
	})
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.error('Error connecting to MongoDB:', err))

app.use('/api/', baseRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/account', accountRoutes)
app.use('/api/products', productRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/billing', billingRoutes)
app.use('/api/lessons', lessonsRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/reach-us', reachUsRoutes)
app.use('/api/categories', categoryRoutes)

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Start the server
const PORT = 8080
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
