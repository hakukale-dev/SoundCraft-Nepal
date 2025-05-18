import { Helmet } from 'react-helmet'

import PurchaseHistoryView from '../../sections/public/purchase-history'

// ----------------------------------------------------------------------

export default function PurchaseHistoryPage() {
	return (
		<>
			<Helmet>Purchase History</Helmet>

			<PurchaseHistoryView />
		</>
	)
}
