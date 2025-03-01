const CryptoJS = require('crypto-js')

function generateSignature(msg) {
	var hash = CryptoJS.HmacSHA256(msg, '8gBm/:&EnhH.1/q')
	var hashInBase64 = CryptoJS.enc.Base64.stringify(hash)

	return hashInBase64
}

module.exports = generateSignature