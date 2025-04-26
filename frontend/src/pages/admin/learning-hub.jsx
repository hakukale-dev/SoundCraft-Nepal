import { Helmet } from 'react-helmet-async'

import AdminLearningHub from 'src/sections/admin/learning-hub'

// ----------------------------------------------------------------------

export default function AdminLearningHubPage() {
	return (
		<>
			<Helmet>
				<title> LearningHub </title>
			</Helmet>

			<AdminLearningHub />
		</>
	)
}
