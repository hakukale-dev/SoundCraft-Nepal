import { Helmet } from 'react-helmet-async'

import PaymentSuccessView from '../../sections/public/payment-success'

// ----------------------------------------------------------------------

export default function PaymentSuccessPage() {
	return (
		<>
			<Helmet>Purchase Success</Helmet>

			<PaymentSuccessView />
		</>
	)
}
