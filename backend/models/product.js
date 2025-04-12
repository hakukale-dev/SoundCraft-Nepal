const mongoose = require('mongoose')

const INSTRUMENT_CATEGORIES = [
	'String Instruments',
	'Woodwind Instruments',
	'Brass Instruments',
	'Percussion Instruments',
	'Keyboard Instruments',
	'Electronic Instruments',
	'Traditional Instruments',
	'Accessories',
]

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Product name is required'],
			trim: true,
		},
		model: {
			type: String,
			required: [true, 'Product model is required'],
			trim: true,
		},
		sku: {
			type: String,
			required: [true, 'Product SKU is required'],
			unique: true,
			trim: true,
		},
		description: {
			type: String,
			required: [true, 'Product description is required'],
		},
		price: {
			type: Number,
			required: [true, 'Product price is required'],
			min: [0, 'Price cannot be negative'],
		},
		category: {
			type: String,
			required: [true, 'Product category is required'],
			enum: INSTRUMENT_CATEGORIES,
		},
		stock: {
			type: Number,
			required: true,
			default: 0,
			min: 0,
		},
		image: {
			type: String,
			required: false,
			default:
				'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F004%2F995%2F985%2Flarge_2x%2Fabstract-guitar-silhouette-with-music-note-inside-free-vector.jpg&f=1&nofb=1&ipt=19ca16005266675f3e209bbe585b6a3fae4218dda7b3cdb204e6e870d2b75b70&ipo=images',
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
productSchema.pre('save', function (next) {
	this.updatedAt = Date.now()
	next()
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
