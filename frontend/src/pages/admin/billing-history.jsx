import { Helmet } from 'react-helmet-async'

import BillingView from 'src/sections/admin/billing-history'

// ----------------------------------------------------------------------

export default function BillingHistoryPage() {
	return (
		<>
			<Helmet>
				<title> Users </title>
			</Helmet>

			<BillingView />
		</>
	)
}
