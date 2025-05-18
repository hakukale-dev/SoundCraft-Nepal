import { Helmet } from 'react-helmet'

import CartPageView from '../../sections/public/cartItems'

// ----------------------------------------------------------------------

function CartItemsPage() {
	return (
		<>
			<Helmet>
				Shopping Cart
			</Helmet>

			<CartPageView />
		</>
	)
}

export default CartItemsPage
