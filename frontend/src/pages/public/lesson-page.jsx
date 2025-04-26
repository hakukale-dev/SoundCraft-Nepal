import { Helmet } from 'react-helmet-async'

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
