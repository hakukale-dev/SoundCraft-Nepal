const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	first_name: {
		type: String,
		required: true,
		trim: true,
	},
	last_name: {
		type: String,
		required: true,
		trim: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
	},
	address: {
		street: { type: String, trim: true },
		city: { type: String, trim: true },
		state: { type: String, trim: true },
		zip_code: { type: String, trim: true },
	},
	phone_number: {
		type: String,
		trim: true,
	},
	dob: {
		type: Date,
		trim: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	is_admin: {
		type: Boolean,
		default: false,
	},
	photo: {
		type: String,
		required: false,
		default: null,
	},
	is_disabled: {
		type: Boolean,
		default: false,
	},
})

const User = mongoose.model('User', userSchema)

module.exports = User
