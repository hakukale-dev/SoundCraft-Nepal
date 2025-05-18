const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		products: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
)

// Update timestamp before saving
wishlistSchema.pre('save', function (next) {
	this.updatedAt = Date.now()
	next()
})

const Wishlist = mongoose.model('Wishlist', wishlistSchema)

module.exports = Wishlist
