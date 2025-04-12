const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Create storage engine for Multer
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'guitar-shop',
		allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
		transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
	},
})

module.exports = { cloudinary, storage }
