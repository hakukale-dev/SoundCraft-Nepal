import { Helmet } from 'react-helmet-async'

import PaymentFailureView from '../../sections/public/payment-failure'

// ----------------------------------------------------------------------

export default function PaymentFailurePage() {
	return (
		<>
			<Helmet>Purchase Success</Helmet>

			<PaymentFailureView />
		</>
	)
}
