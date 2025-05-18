const express = require('express')
const LearningHub = require('../models/lesson')
const { admin, protect } = require('../middleware/authMiddleware')
const { cloudinary } = require('../config/cloudinary')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const upload = multer({ dest: 'uploads/' })

// Accept 'thumbnail' and 'videoFile' fields
const uploadFields = upload.fields([
	{ name: 'thumbnail', maxCount: 1 },
	{ name: 'videoFile', maxCount: 1 },
])

// Create a new lesson
router.post('/', admin, uploadFields, async (req, res) => {
	try {
		if (!req.user || !req.user.is_admin) {
			return res.status(403).json({ message: 'Unauthorized' })
		}

		// Handle thumbnail upload
		if (req.files?.thumbnail?.[0]) {
			const imagePath = req.files.thumbnail[0].path
			const result = await cloudinary.uploader.upload(imagePath, {
				folder: 'guitar-shop/images',
			})
			req.body.thumbnailUrl = result.secure_url
			fs.unlinkSync(imagePath)
		}

		// Handle video upload
		if (req.files?.videoFile?.[0]) {
			const videoPath = req.files.videoFile[0].path
			const result = await cloudinary.uploader.upload(videoPath, {
				resource_type: 'video',
				folder: 'guitar-shop/videos',
			})
			req.body.videoUrl = result.secure_url
			fs.unlinkSync(videoPath)
		}

		const lesson = new LearningHub({
			...req.body,
		})

		await lesson.save()
		res.status(201).json(lesson)
	} catch (error) {
		res.status(400).json({
			message: error.message,
			...(process.env.NODE_ENV === 'development' && {
				stack: error.stack,
			}),
		})
	}
})

// Get all lessons
router.get('/', async (req, res) => {
	try {
		const lessons = await LearningHub.find().sort({ createdAt: -1 })
		res.send(lessons)
	} catch (error) {
		res.status(500).send(error)
	}
})

// Get a specific lesson by ID
router.get('/:id', async (req, res) => {
	try {
		const lesson = await LearningHub.findById(req.params.id).populate(
			'comments.user',
			'name'
		)

		if (!lesson) {
			return res.status(404).send()
		}

		// Increment views
		lesson.views += 1
		await lesson.save()

		res.send(lesson)
	} catch (error) {
		res.status(500).send(error)
	}
})

// Update a lesson
router.patch('/:id', admin, uploadFields, async (req, res) => {
	const updates = Object.keys(req.body)
	const allowedUpdates = [
		'title',
		'description',
		'content',
		'category',
		'difficultyLevel',
		'resources',
		'thumbnailUrl',
		'videoUrl',
	]
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	)

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' })
	}

	try {
		if (!req.user || !req.user.is_admin) {
			return res.status(403).json({ message: 'Unauthorized' })
		}

		// Handle thumbnail update
		if (req.files?.thumbnail?.[0]) {
			const imagePath = req.files.thumbnail[0].path
			const result = await cloudinary.uploader.upload(imagePath, {
				folder: 'guitar-shop/images',
			})
			req.body.thumbnailUrl = result.secure_url
			fs.unlinkSync(imagePath)
		}

		// Handle video update
		if (req.files?.videoFile?.[0]) {
			const videoPath = req.files.videoFile[0].path
			const result = await cloudinary.uploader.upload(videoPath, {
				resource_type: 'video',
				folder: 'guitar-shop/videos',
			})
			req.body.videoUrl = result.secure_url
			fs.unlinkSync(videoPath)
		}

		const lesson = await LearningHub.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		)

		if (!lesson) {
			return res.status(404).send()
		}

		res.send(lesson)
	} catch (error) {
		res.status(400).send(error)
	}
})

// Delete a lesson
router.delete('/:id', admin, async (req, res) => {
	try {
		if (!req.user || !req.user.is_admin) {
			return res.status(403).json({ message: 'Unauthorized' })
		}

		const lesson = await LearningHub.findById(req.params.id)

		if (!lesson) {
			return res.status(404).send()
		}

		// Delete thumbnail from Cloudinary if it exists
		if (lesson.thumbnailUrl) {
			const publicId = lesson.thumbnailUrl.split('/').pop().split('.')[0]
			await cloudinary.uploader.destroy(`guitar-shop/images/${publicId}`)
		}

		// Delete video from Cloudinary if it exists
		if (lesson.videoUrl) {
			const publicId = lesson.videoUrl.split('/').pop().split('.')[0]
			await cloudinary.uploader.destroy(
				`guitar-shop/videos/${publicId}`,
				{
					resource_type: 'video',
				}
			)
		}

		// Delete the lesson document
		await LearningHub.findByIdAndDelete(req.params.id)

		res.send({ message: 'Lesson deleted successfully' })
	} catch (error) {
		res.status(500).send(error)
	}
})

// Add a comment to a lesson
router.post('/:id/comments', protect, async (req, res) => {
	try {
		const lesson = await LearningHub.findById(req.params.id)

		if (!lesson) {
			return res.status(404).send()
		}

		const comment = {
			...req.body,
			user: req.user._id,
		}

		lesson.comments.push(comment)
		await lesson.save()
		res.status(201).send(lesson)
	} catch (error) {
		res.status(400).send(error)
	}
})

// Like a lesson
router.post('/:id/like', protect, async (req, res) => {
	try {
		const lesson = await LearningHub.findById(req.params.id)

		if (!lesson) {
			return res.status(404).send()
		}

		if (lesson.likes.includes(req.user._id)) {
			return res.status(400).send({ error: 'Already liked' })
		}

		lesson.likes.push(req.user._id)
		await lesson.save()
		res.send(lesson)
	} catch (error) {
		res.status(400).send(error)
	}
})

module.exports = router
