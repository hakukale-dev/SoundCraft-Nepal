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
	params: (req, file) => {
		const isVideo = ['mp4', 'mov', 'avi'].includes(
			file.mimetype.split('/')[1]
		)
		const folder = isVideo ? 'guitar-shop/videos' : 'guitar-shop/images'

		return {
			folder: folder,
			allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'],
			transformation: isVideo
				? []
				: [{ width: 1000, height: 1000, crop: 'limit' }],
			resource_type: 'auto',
		}
	},
})

module.exports = { cloudinary, storage }
