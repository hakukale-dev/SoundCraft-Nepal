import { Helmet } from 'react-helmet'
import CheckoutPageView from '../../sections/public/checkout'

// ----------------------------------------------------------------------

function CheckoutPage() {
	return (
		<>
			<Helmet>
				<title> Checkout </title>
			</Helmet>

			<CheckoutPageView />
		</>
	)
}

export default CheckoutPage
