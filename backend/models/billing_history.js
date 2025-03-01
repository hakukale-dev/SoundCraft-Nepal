const mongoose = require('mongoose')

const billingHistorySchema = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		payment_method: {
			type: String,
			enum: ['esewa', 'khalti', 'other'],
			required: true,
		},
		amount: {
			type: Number,
			required: true,
			min: 0,
		},
		status: {
			type: String,
			enum: ['pending', 'completed', 'failed'],
			default: 'pending',
		},
		items: [
			{
				product_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price_per: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		payment_reference_id: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
)

const BillingHistory = mongoose.model('BillingHistory', billingHistorySchema)

module.exports = BillingHistory
