import { Helmet } from 'react-helmet'

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
