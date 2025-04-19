import React from 'react'
import {
	Box,
	Container,
	Typography,
	Grid,
	Card,
	CardContent,
	CardMedia,
	Button,
} from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledCard = styled(Card)(({ theme }) => ({
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	transition: 'transform 0.2s',
	'&:hover': {
		transform: 'scale(1.02)',
	},
}))

const resources = [
	{
		title: 'Guitar Mastery',
		description:
			'Learn guitar techniques from beginner to advanced levels.',
		image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		link: 'https://www.justinguitar.com',
	},
	{
		title: 'Piano Lessons',
		description: 'Step-by-step piano tutorials for all skill levels.',
		image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		link: 'https://www.pianote.com',
	},
	{
		title: 'Drumming Techniques',
		description: 'Master drumming fundamentals and advanced rhythms.',
		image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		link: 'https://www.drumeo.com',
	},
	{
		title: 'Violin Tutorials',
		description: 'Learn proper violin techniques and classical pieces.',
		image: 'https://images.unsplash.com/photo-1460036521480-ff49c08c2781?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		link: 'https://www.violinonline.com',
	},
	{
		title: 'Bass Guitar Basics',
		description: 'Essential lessons for mastering the bass guitar.',
		image: 'https://images.unsplash.com/photo-1462965326201-d02e4f455804?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		link: 'https://www.studybass.com',
	},
	{
		title: 'Saxophone Skills',
		description: 'Develop your saxophone playing with expert guidance.',
		image: 'https://images.unsplash.com/photo-1630492096725-d256050e7993?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		link: 'https://www.saxschoolonline.com',
	},
]

const LearningZoneView = () => {
	return (
		<Box sx={{ py: 8, bgcolor: 'background.paper' }}>
			<Container maxWidth="lg">
				<Typography
					variant="h2"
					component="h1"
					align="center"
					gutterBottom
					sx={{ mb: 6 }}>
					Learning Zone
				</Typography>
				<Typography
					variant="h5"
					component="h2"
					align="center"
					color="text.secondary"
					sx={{ mb: 8 }}>
					Explore our comprehensive learning resources
				</Typography>

				<Grid
					container
					spacing={4}>
					{resources.map((resource, index) => (
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							key={index}>
							<StyledCard>
								<CardMedia
									component="img"
									height="200"
									image={resource.image}
									alt={resource.title}
								/>
								<CardContent sx={{ flexGrow: 1 }}>
									<Typography
										gutterBottom
										variant="h5"
										component="h2">
										{resource.title}
									</Typography>
									<Typography>
										{resource.description}
									</Typography>
								</CardContent>
								<Box sx={{ p: 2 }}>
									<Button
										variant="contained"
										color="primary"
										href={resource.link}
										fullWidth>
										Learn More
									</Button>
								</Box>
							</StyledCard>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	)
}

export default LearningZoneView
// import React, { useState } from 'react'
// import {
// 	Box,
// 	Container,
// 	Typography,
// 	Grid,
// 	Card,
// 	CardContent,
// 	CardMedia,
// 	Button,
// 	Chip,
// 	TextField,
// 	InputAdornment,
// } from '@mui/material'
// import { motion } from 'framer-motion'
// import { styled } from '@mui/material/styles'
// import SearchIcon from '@mui/icons-material/Search'
// import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'

// const StyledCard = styled(Card)(({ theme }) => ({
// 	height: '100%',
// 	display: 'flex',
// 	flexDirection: 'column',
// 	transition: 'transform 0.3s ease, box-shadow 0.3s ease',
// 	'&:hover': {
// 		transform: 'translateY(-5px)',
// 		boxShadow: theme.shadows[6],
// 	},
// }))

// const GradientOverlay = styled(Box)(({ theme }) => ({
// 	position: 'absolute',
// 	top: 0,
// 	left: 0,
// 	right: 0,
// 	bottom: 0,
// 	background:
// 		'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)',
// 	opacity: 0,
// 	transition: 'opacity 0.3s ease',
// 	'&:hover': {
// 		opacity: 1,
// 	},
// }))

// const resources = [
// 	{
// 		title: 'Music Theory Basics',
// 		category: 'Fundamentals',
// 		duration: '6h 20m',
// 		description:
// 			'Master scales, chords, and rhythm with interactive lessons',
// 		image: '/assets/images/learning/music-theory.jpg',
// 		link: '/learn/music-theory',
// 	},
// ]

// const LearningZoneView = () => {
// 	const [searchQuery, setSearchQuery] = useState('')

// 	const filteredResources = resources.filter(
// 		(resource) =>
// 			resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
// 			resource.category
// 				.toLowerCase()
// 				.includes(searchQuery.toLowerCase()) ||
// 			resource.description
// 				.toLowerCase()
// 				.includes(searchQuery.toLowerCase())
// 	)

// 	return (
// 		<Box sx={{ py: 8, bgcolor: 'background.default' }}>
// 			<Container maxWidth="xl">
// 				<Box
// 					textAlign="center"
// 					mb={8}>
// 					<motion.div
// 						initial={{ opacity: 0, y: 20 }}
// 						animate={{ opacity: 1, y: 0 }}
// 						transition={{ duration: 0.6 }}>
// 						<Typography
// 							variant="h1"
// 							component="h1"
// 							gutterBottom
// 							sx={{
// 								fontWeight: 800,
// 								letterSpacing: '-0.05em',
// 								mb: 2,
// 							}}>
// 							Music Learning Hub
// 						</Typography>
// 						<Typography
// 							variant="h5"
// 							component="p"
// 							color="text.secondary"
// 							sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
// 							Discover curated courses, tutorials, and resources
// 							to elevate your musical journey
// 						</Typography>

// 						<TextField
// 							variant="outlined"
// 							placeholder="Search courses..."
// 							fullWidth
// 							sx={{
// 								maxWidth: 600,
// 								'& .MuiOutlinedInput-root': {
// 									borderRadius: 4,
// 									bgcolor: 'background.paper',
// 								},
// 							}}
// 							InputProps={{
// 								startAdornment: (
// 									<InputAdornment position="start">
// 										<SearchIcon color="action" />
// 									</InputAdornment>
// 								),
// 							}}
// 							value={searchQuery}
// 							onChange={(e) => setSearchQuery(e.target.value)}
// 						/>
// 					</motion.div>
// 				</Box>

// 				<Grid
// 					container
// 					spacing={4}>
// 					{filteredResources.map((resource, index) => (
// 						<Grid
// 							item
// 							xs={12}
// 							sm={6}
// 							lg={4}
// 							key={index}>
// 							<motion.div
// 								initial={{ opacity: 0, y: 50 }}
// 								animate={{ opacity: 1, y: 0 }}
// 								transition={{ delay: index * 0.1 }}>
// 								<StyledCard>
// 									<Box
// 										sx={{
// 											position: 'relative',
// 											height: 240,
// 										}}>
// 										<CardMedia
// 											component="img"
// 											height="240"
// 											image={resource.image}
// 											alt={resource.title}
// 											sx={{
// 												position: 'absolute',
// 												height: '100%',
// 											}}
// 										/>
// 										<GradientOverlay />
// 										<Box
// 											sx={{
// 												position: 'absolute',
// 												bottom: 16,
// 												left: 16,
// 												right: 16,
// 												zIndex: 1,
// 											}}>
// 											<Chip
// 												label={resource.category}
// 												color="primary"
// 												size="small"
// 												sx={{ mb: 1, fontWeight: 600 }}
// 											/>
// 											<Typography
// 												variant="h5"
// 												component="h3"
// 												sx={{
// 													color: 'common.white',
// 													fontWeight: 700,
// 													textShadow:
// 														'0 2px 4px rgba(0,0,0,0.5)',
// 												}}>
// 												{resource.title}
// 											</Typography>
// 											<Typography color="rgba(255,255,255,0.9)">
// 												{resource.duration} • Beginner
// 												Friendly
// 											</Typography>
// 										</Box>
// 									</Box>

// 									<CardContent sx={{ flexGrow: 1 }}>
// 										<Typography
// 											paragraph
// 											sx={{ minHeight: 80 }}>
// 											{resource.description}
// 										</Typography>
// 										<Box sx={{ display: 'flex', gap: 2 }}>
// 											<Button
// 												variant="contained"
// 												color="primary"
// 												href={resource.link}
// 												fullWidth>
// 												Start Course
// 											</Button>
// 											<Button
// 												variant="outlined"
// 												color="inherit"
// 												startIcon={
// 													<BookmarkBorderIcon />
// 												}>
// 												Save
// 											</Button>
// 										</Box>
// 									</CardContent>
// 								</StyledCard>
// 							</motion.div>
// 						</Grid>
// 					))}
// 				</Grid>

// 				{filteredResources.length === 0 && (
// 					<Box
// 						textAlign="center"
// 						py={10}>
// 						<Typography
// 							variant="h5"
// 							color="text.secondary"
// 							gutterBottom>
// 							No courses found
// 						</Typography>
// 						<Typography color="text.secondary">
// 							Try adjusting your search terms
// 						</Typography>
// 					</Box>
// 				)}
// 			</Container>
// 		</Box>
// 	)
// }

// export default LearningZoneView
