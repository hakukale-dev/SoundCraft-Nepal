import { Helmet } from 'react-helmet-async'
import { Container } from '@mui/material'

import OrdersView from 'src/sections/admin/orders'

// ----------------------------------------------------------------------

export default function OrdersPage() {
	return (
		<>
			<Helmet>
				<title> Orders | Admin </title>
			</Helmet>

			<Container maxWidth="xl">
				<OrdersView />
			</Container>
		</>
	)
}
