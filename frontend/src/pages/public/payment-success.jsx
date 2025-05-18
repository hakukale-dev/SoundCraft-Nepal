import { Helmet } from 'react-helmet'

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
