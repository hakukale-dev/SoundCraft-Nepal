import React, { useState, useEffect } from 'react'
import {
	Box,
	Container,
	Typography,
	Grid,
	Card,
	CardContent,
	CardMedia,
	Button,
	Chip,
	TextField,
	InputAdornment,
	useTheme,
	useMediaQuery,
} from '@mui/material'
import { motion } from 'framer-motion'
import { styled } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import axios from 'src/utils/axios'
import { useNavigate } from 'react-router-dom'

const StyledCard = styled(Card)(({ theme }) => ({
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	transition: 'transform 0.3s ease, box-shadow 0.3s ease',
	'&:hover': {
		transform: 'translateY(-5px)',
		boxShadow: theme.shadows[6],
	},
}))

const GradientOverlay = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	background:
		'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)',
	opacity: 0,
	transition: 'opacity 0.3s ease',
	'&:hover': {
		opacity: 1,
	},
}))

const LearningZoneView = () => {
	const [searchQuery, setSearchQuery] = useState('')
	const [lessons, setLessons] = useState([])
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	useEffect(() => {
		const fetchLessons = async () => {
			try {
				const response = await axios.get('api/lessons')
				setLessons(response.data)
				setLoading(false)
			} catch (error) {
				console.error('Error fetching lessons:', error)
				setLoading(false)
			}
		}

		fetchLessons()
	}, [])

	const filteredResources = lessons.filter(
		(lesson) =>
			lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			lesson.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
			lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const handleLessonClick = (lessonId) => {
		navigate(`/lessons/${lessonId}`)
	}

	return (
		<Box sx={{ py: isMobile ? 4 : 8, bgcolor: 'background.default' }}>
			<Container maxWidth="xl">
				<Box
					textAlign="center"
					mb={isMobile ? 4 : 8}>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}>
						<Typography
							variant={isMobile ? 'h3' : 'h1'}
							component="h1"
							gutterBottom
							sx={{
								fontWeight: 800,
								letterSpacing: '-0.05em',
								mb: 2,
								fontSize: isMobile ? '2rem' : '3rem',
							}}>
							Music Learning Hub
						</Typography>
						<Typography
							variant={isMobile ? 'body1' : 'h5'}
							component="p"
							color="text.secondary"
							sx={{
								maxWidth: 800,
								mx: 'auto',
								mb: 4,
								px: isMobile ? 2 : 0,
							}}>
							Explore tutorial to help you in your musical journey
						</Typography>

						<TextField
							variant="outlined"
							placeholder="Search courses..."
							fullWidth
							sx={{
								maxWidth: 600,
								'& .MuiOutlinedInput-root': {
									borderRadius: 4,
									bgcolor: 'background.paper',
								},
							}}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon color="action" />
									</InputAdornment>
								),
							}}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</motion.div>
				</Box>

				{loading ? (
					<Box
						textAlign="center"
						py={10}>
						<Typography
							variant={isMobile ? 'body1' : 'h5'}
							color="text.secondary">
							Loading lessons...
						</Typography>
					</Box>
				) : (
					<Grid
						container
						spacing={isMobile ? 2 : 4}>
						{filteredResources.map((lesson, index) => (
							<Grid
								item
								xs={12}
								sm={6}
								lg={4}
								key={lesson._id}>
								<motion.div
									initial={{ opacity: 0, y: 50 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}>
									<StyledCard>
										<Box
											sx={{
												position: 'relative',
												height: isMobile ? 180 : 240,
											}}>
											<CardMedia
												component="img"
												height={isMobile ? 180 : 240}
												image={lesson.thumbnailUrl}
												alt={lesson.title}
												sx={{
													position: 'absolute',
													height: '100%',
												}}
											/>
											<GradientOverlay />
											<Box
												sx={{
													position: 'absolute',
													bottom: isMobile ? 8 : 16,
													left: isMobile ? 8 : 16,
													right: isMobile ? 8 : 16,
													zIndex: 1,
												}}>
												<Chip
													label={lesson.category}
													color="primary"
													size="small"
													sx={{
														mb: 1,
														fontWeight: 600,
														fontSize: isMobile
															? '0.6rem'
															: '0.8125rem',
													}}
												/>
												<Typography
													variant={
														isMobile ? 'h6' : 'h5'
													}
													component="h3"
													sx={{
														color: 'common.white',
														fontWeight: 700,
														textShadow:
															'0 2px 4px rgba(0,0,0,0.5)',
														fontSize: isMobile
															? '1.1rem'
															: '1.5rem',
													}}>
													{lesson.title}
												</Typography>
												<Typography
													variant={
														isMobile
															? 'caption'
															: 'body2'
													}
													color="rgba(255,255,255,0.9)">
													{lesson.difficultyLevel}
												</Typography>
											</Box>
										</Box>

										<CardContent
											sx={{
												flexGrow: 1,
												p: isMobile ? 1.5 : 2,
											}}>
											<Typography
												paragraph
												variant={
													isMobile ? 'body2' : 'body1'
												}
												sx={{
													minHeight: isMobile
														? 60
														: 80,
													mb: isMobile ? 1 : 2,
												}}>
												{lesson.description}
											</Typography>
											<Box
												sx={{
													display: 'flex',
													gap: isMobile ? 1 : 2,
												}}>
												<Button
													variant="contained"
													color="primary"
													size={
														isMobile
															? 'small'
															: 'medium'
													}
													onClick={() =>
														handleLessonClick(
															lesson._id
														)
													}
													fullWidth>
													View
												</Button>
											</Box>
										</CardContent>
									</StyledCard>
								</motion.div>
							</Grid>
						))}
					</Grid>
				)}

				{!loading && filteredResources.length === 0 && (
					<Box
						textAlign="center"
						py={10}>
						<Typography
							variant={isMobile ? 'h6' : 'h5'}
							color="text.secondary"
							gutterBottom>
							No courses found
						</Typography>
						<Typography
							variant={isMobile ? 'body2' : 'body1'}
							color="text.secondary"
							sx={{ px: isMobile ? 2 : 0 }}>
							Try adjusting your search terms
						</Typography>
					</Box>
				)}
			</Container>
		</Box>
	)
}

export default LearningZoneView
