const mongoose = require('mongoose')

const learningHubSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
		trim: true,
	},
	content: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
		enum: [
			'Music Theory',
			'Instrument Techniques',
			'Composition',
			'Music Production',
			'History of Music',
			'Performance Tips',
		],
	},
	difficultyLevel: {
		type: String,
		required: true,
		enum: ['Beginner', 'Intermediate', 'Advanced'],
	},
	thumbnailUrl: {
		type: String,
	},
	videoUrl: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	comments: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			text: String,
			createdAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
	resources: [
		{
			type: {
				type: String,
				enum: ['video', 'article', 'pdf', 'audio'],
			},
			url: String,
			description: String,
		},
	],
})

learningHubSchema.pre('save', function (next) {
	this.updatedAt = Date.now()
	next()
})

const LearningHub = mongoose.model('LearningHub', learningHubSchema)

module.exports = LearningHub
