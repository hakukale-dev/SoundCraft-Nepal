const nodemailer = require('nodemailer')
const emailConfig = require('../config/email')

const transporter = nodemailer.createTransport(emailConfig)

const sendEmail = async (options) => {
	try {
		const mailOptions = {
			from: `"SoundCraft" <${emailConfig.auth.user}>`,
			to: options.email,
			subject: options.subject,
			text: options.message,
			html: options.html,
		}

		await transporter.sendMail(mailOptions)
	} catch (error) {
		console.error('Error sending email:', error)
		throw error
	}
}

module.exports = {
	sendEmail,
}
