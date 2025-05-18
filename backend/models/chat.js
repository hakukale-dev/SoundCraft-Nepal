const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		message: {
			type: String,
			required: true,
		},
		isRead: {
			type: Boolean,
			default: false,
		},
		isSupport: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Chat', chatSchema)
