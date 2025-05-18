const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 300, // OTP expires after 5 minutes (300 seconds)
	},
})

// Pre-save hook to hash OTP before saving
otpSchema.pre('save', async function (next) {
	if (!this.isModified('otp')) return next()

	try {
		const salt = await bcrypt.genSalt(10)
		this.otp = await bcrypt.hash(this.otp, salt)
		next()
	} catch (err) {
		next(err)
	}
})

// Method to compare OTP
otpSchema.methods.compareOTP = async function (candidateOTP) {
	return await bcrypt.compare(candidateOTP, this.otp)
}

const OTP = mongoose.model('OTP', otpSchema)

module.exports = OTP
