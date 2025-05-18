const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Category name is required'],
			unique: true,
			trim: true,
		},
		description: {
			type: String,
			required: false,
		},
		type: {
			type: String,
			required: [true, 'Category type is required'],
			enum: ['product', 'lesson'],
			default: 'product',
		},
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

// Update the updatedAt timestamp before saving
categorySchema.pre('save', function (next) {
	this.updatedAt = Date.now()
	next()
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
