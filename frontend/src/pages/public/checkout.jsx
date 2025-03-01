import { Helmet } from 'react-helmet-async'
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
