const { cloudinary } = require('../config/cloudinary')

const uploadToCloudinary = async (file) => {
	try {
		const result = await cloudinary.uploader.upload(file.path, {
			folder: 'guitar-shop',
			transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
		})
		return result
	} catch (error) {
		throw new Error(`Error uploading to Cloudinary: ${error.message}`)
	}
}

const deleteFromCloudinary = async (publicId) => {
	try {
		await cloudinary.uploader.destroy(publicId)
	} catch (error) {
		throw new Error(`Error deleting from Cloudinary: ${error.message}`)
	}
}

module.exports = {
	uploadToCloudinary,
	deleteFromCloudinary,
}
