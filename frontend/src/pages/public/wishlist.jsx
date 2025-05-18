import { Helmet } from 'react-helmet'

import WishlistView from 'src/sections/public/wishlist'

// ----------------------------------------------------------------------

export default function WishlistPage() {
	return (
		<>
			<Helmet>
				<title> Wishlist </title>
			</Helmet>

			<WishlistView />
		</>
	)
}
