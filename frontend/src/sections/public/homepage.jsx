import { useTheme } from '@mui/material/styles'
import Carousel from 'react-material-ui-carousel'
import { useState, useEffect } from 'react'
import {
	Card,
	Grid,
	Stack,
	Button,
	CardMedia,
	Container,
	Typography,
	CardContent,
	Box,
	CircularProgress,
	Chip,
	useMediaQuery,
	Avatar,
	Rating,
} from '@mui/material'
import axios from 'src/utils/axios'
import {
	KeyboardArrowRight,
	NewReleases,
	Whatshot,
	Star,
	Piano,
} from '@mui/icons-material'
import {
	GiDrumKit,
	GiFlute,
	GiGuitar,
	GiHarp,
	GiHeadphones,
	GiKeyboard,
	GiPianoKeys,
	GiTrumpet,
} from 'react-icons/gi'
import { motion } from 'framer-motion'
import ProductScrollSection from '../../components/ProductScrollSection'
import { useNavigate } from 'react-router-dom'
import Skeleton from '@mui/material/Skeleton'

const carouselItems = [
	{
		image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		title: 'Premium Guitar Selection',
		description: 'Explore our handpicked collection of finest guitars',
	},
	{
		image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
		title: 'Summer Sale Live Now',
		description: 'Up to 30% off on selected electric guitars',
	},
]

const MotionCard = motion(Card)
const MotionButton = motion(Button)
const MotionChip = motion(Chip)

function HomepageView() {
	const theme = useTheme()
	const navigate = useNavigate()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const [homepageData, setHomepageData] = useState({
		categories: {},
		featuredProducts: [],
		trendingProducts: [],
		newArrivals: [],
	})
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchHomepageData = async () => {
			try {
				const response = await axios.get('/api/homepage')
				setHomepageData({
					categories: response.data.categories,
					featuredProducts: response.data.featuredProducts,
					trendingProducts: response.data.trendingProducts,
					newArrivals: response.data.newArrivals,
				})
			} catch (error) {
				console.error('Error fetching homepage data:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchHomepageData()
	}, [])

	return (
		<Box sx={{ py: isMobile ? 4 : 8 }}>
			{/* Hero Carousel */}
			<Box sx={{ mb: isMobile ? 5 : 10 }}>
				{loading ? (
					<Skeleton
						variant="rectangular"
						height={isMobile ? 300 : 600}
						width="100%"
					/>
				) : (
					<Carousel
						animation="fade"
						indicators={!isMobile}
						navButtonsAlwaysVisible={!isMobile}
						height={isMobile ? 300 : 600}
						autoPlay
						interval={5000}
						sx={{
							borderRadius: 2,
							overflow: 'hidden',
							boxShadow: theme.shadows[3],
							mx: isMobile ? 0 : 2,
						}}>
						{carouselItems.map((item, i) => (
							<Box
								key={i}
								sx={{ position: 'relative', height: '100%' }}>
								<CardMedia
									component="img"
									image={item.image}
									alt={item.title}
									sx={{
										height: '100%',
										objectFit: 'cover',
										filter: 'brightness(0.7)',
									}}
								/>
								<Box
									sx={{
										position: 'absolute',
										top: '50%',
										left: '50%',
										transform: 'translate(-50%, -50%)',
										textAlign: 'center',
										color: 'white',
										width: '90%',
										px: isMobile ? 2 : 0,
									}}>
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}>
										<Typography
											variant={isMobile ? 'h4' : 'h1'}
											sx={{
												fontWeight: 900,
												mb: isMobile ? 1 : 2,
												textShadow:
													'2px 2px 8px rgba(0,0,0,0.7)',
												lineHeight: 1.2,
												fontSize: isMobile
													? '1.8rem'
													: '3rem',
											}}>
											{item.title}
										</Typography>
										<Typography
											variant={isMobile ? 'body1' : 'h5'}
											sx={{
												mb: isMobile ? 2 : 4,
												textShadow:
													'1px 1px 4px rgba(0,0,0,0.7)',
												maxWidth: 800,
												mx: 'auto',
												fontSize: isMobile
													? '1rem'
													: '1.5rem',
											}}>
											{item.description}
										</Typography>
										<MotionButton
											whileHover={{ scale: 1.05 }}
											variant="contained"
											size={isMobile ? 'medium' : 'large'}
											endIcon={<KeyboardArrowRight />}
											sx={{
												px: isMobile ? 3 : 5,
												py: isMobile ? 1 : 1.5,
												fontSize: isMobile
													? '0.9rem'
													: '1.1rem',
												borderRadius: 3,
												textTransform: 'none',
											}}>
											Shop Now
										</MotionButton>
									</motion.div>
								</Box>
							</Box>
						))}
					</Carousel>
				)}
			</Box>

			<Container
				maxWidth="xl"
				sx={{ px: isMobile ? 2 : 0 }}>
				{/* Categories */}
				<Box sx={{ mb: isMobile ? 5 : 10 }}>
					<Typography
						variant={isMobile ? 'h4' : 'h3'}
						gutterBottom
						sx={{
							fontWeight: 700,
							color: 'text.primary',
							textAlign: 'center',
							mb: isMobile ? 3 : 6,
						}}>
						Explore Categories
					</Typography>
					<Grid
						container
						spacing={isMobile ? 1 : 3}
						justifyContent="center">
						{loading ? (
							<>
								{[...Array(6)].map((_, i) => (
									<Grid
										item
										xs={6}
										sm={4}
										md={3}
										lg={2}
										key={i}>
										<Skeleton
											variant="rectangular"
											height={50}
										/>
									</Grid>
								))}
							</>
						) : (
							Object.entries(homepageData.categories).map(
								([category, count]) => {
									const getCategoryIcon = () => {
										switch (category) {
											case 'String Instruments':
												return (
													<GiGuitar
														size={
															isMobile ? 20 : 24
														}
													/>
												)
											case 'Woodwind Instruments':
												return (
													<GiFlute
														size={
															isMobile ? 20 : 24
														}
													/>
												)
											case 'Brass Instruments':
												return (
													<GiTrumpet
														size={
															isMobile ? 20 : 24
														}
													/>
												)
											case 'Percussion Instruments':
												return (
													<GiDrumKit
														size={
															isMobile ? 20 : 24
														}
													/>
												)
											case 'Keyboard Instruments':
												return (
													<GiKeyboard
														size={
															isMobile ? 20 : 24
														}
													/>
												)
											case 'Electronic Instruments':
												return (
													<GiDrumKit
														size={
															isMobile ? 20 : 24
														}
													/>
												)
											case 'Traditional Instruments':
												return (
													<GiHarp
														size={
															isMobile ? 20 : 24
														}
													/>
												)
											case 'Accessories':
												return (
													<GiHeadphones
														size={
															isMobile ? 20 : 24
														}
													/>
												)
											default:
												return (
													<MusicNote
														size={
															isMobile ? 20 : 24
														}
													/>
												)
										}
									}

									return (
										<Grid
											item
											key={category}
											xs={6}
											sm={4}
											md={3}
											lg={2}>
											<MotionChip
												whileHover={{
													scale: isMobile ? 1 : 1.05,
												}}
												clickable
												variant="outlined"
												label={
													<Stack
														direction="row"
														alignItems="center"
														gap={isMobile ? 1 : 2}>
														{getCategoryIcon()}
														<Typography
															variant={
																isMobile
																	? 'body2'
																	: 'body1'
															}>
															{category}
														</Typography>
													</Stack>
												}
												onClick={() =>
													navigate(
														`/products?category=${category}`
													)
												}
												sx={{
													width: '100%',
													py: isMobile ? 1 : 2,
													fontSize: isMobile
														? '0.9rem'
														: '1.1rem',
													borderRadius: 2,
													borderWidth: isMobile
														? 1
														: 2,
													borderColor: 'primary.main',
													color: 'primary.main',
													'&:hover': {
														bgcolor:
															'primary.light',
														color: 'primary.secondary',
													},
													transition: 'all 0.3s ease',
												}}
											/>
										</Grid>
									)
								}
							)
						)}
					</Grid>
				</Box>

				{/* Featured Products */}
				{loading ? (
					<Skeleton
						variant="rectangular"
						height={isMobile ? 200 : 300}
					/>
				) : (
					<ProductScrollSection
						title="Featured Collection"
						icon={
							<Whatshot
								sx={{
									fontSize: isMobile ? 30 : 40,
									color: 'warning.main',
								}}
							/>
						}
						items={homepageData.featuredProducts}
						mobile={isMobile}
					/>
				)}

				{/* Trending Products */}
				{loading ? (
					<Skeleton
						variant="rectangular"
						height={isMobile ? 200 : 300}
					/>
				) : (
					<ProductScrollSection
						title="Trending Now"
						icon={
							<Whatshot
								sx={{
									fontSize: isMobile ? 30 : 40,
									color: 'error.main',
								}}
							/>
						}
						items={homepageData.trendingProducts}
						mobile={isMobile}
					/>
				)}

				{/* New Arrivals */}
				{loading ? (
					<Skeleton
						variant="rectangular"
						height={isMobile ? 200 : 300}
					/>
				) : (
					<ProductScrollSection
						title="New Arrivals"
						icon={
							<NewReleases
								sx={{
									fontSize: isMobile ? 30 : 40,
									color: 'success.main',
								}}
							/>
						}
						items={homepageData.newArrivals}
						mobile={isMobile}
					/>
				)}
			</Container>
		</Box>
	)
}

export default HomepageView
