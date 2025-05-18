import { Helmet } from 'react-helmet'

import LessonPageView from '../../sections/public/lesson-page'

// ----------------------------------------------------------------------

export default function LessonPage() {
	return (
		<>
			<Helmet>Lesson Page</Helmet>

			<LessonPageView />
		</>
	)
}
