import { Helmet } from 'react-helmet-async'

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
