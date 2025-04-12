import { m } from 'framer-motion'

// ----------------------------------------------------------------------

export const varFade = (props) => {
	const distance = props?.distance || 120
	const durationIn = props?.durationIn || 0.64
	const durationOut = props?.durationOut || 0.48
	const easeIn = props?.easeIn || [0.42, 0, 1, 1]
	const easeOut = props?.easeOut || [0, 0, 0.58, 1]

	return {
		in: {
			initial: { opacity: 0, y: distance },
			animate: {
				opacity: 1,
				y: 0,
				transition: { duration: durationIn, ease: easeIn },
			},
			exit: {
				opacity: 0,
				y: distance,
				transition: { duration: durationOut, ease: easeOut },
			},
		},
		inUp: {
			initial: { opacity: 0, y: distance },
			animate: {
				opacity: 1,
				y: 0,
				transition: { duration: durationIn, ease: easeIn },
			},
			exit: {
				opacity: 0,
				y: distance,
				transition: { duration: durationOut, ease: easeOut },
			},
		},
		inDown: {
			initial: { opacity: 0, y: -distance },
			animate: {
				opacity: 1,
				y: 0,
				transition: { duration: durationIn, ease: easeIn },
			},
			exit: {
				opacity: 0,
				y: -distance,
				transition: { duration: durationOut, ease: easeOut },
			},
		},
		inLeft: {
			initial: { opacity: 0, x: -distance },
			animate: {
				opacity: 1,
				x: 0,
				transition: { duration: durationIn, ease: easeIn },
			},
			exit: {
				opacity: 0,
				x: -distance,
				transition: { duration: durationOut, ease: easeOut },
			},
		},
		inRight: {
			initial: { opacity: 0, x: distance },
			animate: {
				opacity: 1,
				x: 0,
				transition: { duration: durationIn, ease: easeIn },
			},
			exit: {
				opacity: 0,
				x: distance,
				transition: { duration: durationOut, ease: easeOut },
			},
		},
	}
}

export const MotionContainer = ({ children, ...other }) => {
	return (
		<m.div
			initial="initial"
			animate="animate"
			exit="exit"
			{...other}>
			{children}
		</m.div>
	)
}
