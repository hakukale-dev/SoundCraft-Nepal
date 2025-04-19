import { Helmet } from 'react-helmet-async'

import LearningZoneView from '../../sections/public/learning-zone'

// ----------------------------------------------------------------------

export default function LearningZonePage() {
	return (
		<>
			<Helmet>
				<title> Learning Zone </title>
			</Helmet>

			<LearningZoneView />
		</>
	)
}
