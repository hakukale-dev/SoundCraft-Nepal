const multer = require('multer')
const { storage } = require('../config/cloudinary')

// File filter
const fileFilter = (req, file, cb) => {
	// Accept images only
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return cb(new Error('Only image files are allowed!'), false)
	}
	cb(null, true)
}

// Create upload middleware
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB max file size
	},
	fileFilter: fileFilter,
})

module.exports = upload
