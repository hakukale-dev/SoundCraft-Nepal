import { Helmet } from 'react-helmet'

import QueriesView from 'src/sections/admin/queries'

// ----------------------------------------------------------------------

export default function AdminQueriesPage() {
	return (
		<>
			<Helmet>
				<title> Queries </title>
			</Helmet>

			<QueriesView />
		</>
	)
}
