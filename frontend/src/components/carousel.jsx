import { useState } from 'react'
import Carousel from 'react-material-ui-carousel'
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material'
import Iconify from './iconify'

export function ProductDetailsCarousel({ images }) {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const [currentIndex, setCurrentIndex] = useState(0)

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % images.length)
	}

	const handlePrev = () => {
		setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
	}

	return (
		<Box sx={{ position: 'relative' }}>
			<Carousel
				index={currentIndex}
				onChange={(index) => setCurrentIndex(index)}
				navButtonsAlwaysVisible={!isMobile}
				fullHeightHover={false}
				animation="fade"
				NavButton={({ onClick, next, prev }) => (
					<IconButton
						onClick={onClick}
						size={isMobile ? 'small' : 'medium'}
						sx={{
							position: 'absolute',
							[prev ? 'left' : 'right']: isMobile ? 8 : 16,
							top: '50%',
							transform: 'translateY(-50%)',
							zIndex: 2,
							bgcolor: 'background.paper',
							'&:hover': {
								bgcolor: 'background.neutral',
							},
						}}>
						<Iconify
							icon={`eva:arrow-ios-${
								prev ? 'back' : 'forward'
							}-fill`}
							width={isMobile ? 20 : 24}
						/>
					</IconButton>
				)}>
				{images.map((image, index) => (
					<Box
						key={index}
						sx={{
							position: 'relative',
							paddingTop: isMobile ? '80%' : '100%',
							overflow: 'hidden',
							borderRadius: 2,
						}}>
						<img
							src={image}
							alt={`Product ${index + 1}`}
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								objectFit: 'cover',
							}}
						/>
					</Box>
				))}
			</Carousel>
		</Box>
	)
}
