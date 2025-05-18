import { Helmet } from 'react-helmet'

import ResetPasswordView from 'src/sections/auth/reset-password'

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
	return (
		<>
			<Helmet>
				<title> Reset Password </title>
			</Helmet>

			<ResetPasswordView />
		</>
	)
}
