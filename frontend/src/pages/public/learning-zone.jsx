import { Helmet } from 'react-helmet'

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
