import { useState, useEffect } from 'react'
import {
	Container,
	Stack,
	Typography,
	Box,
	Button,
	Grid,
	IconButton,
	Skeleton,
	Alert,
	useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import axios from 'src/utils/axios'
import { useSelector } from 'react-redux'
import Iconify from 'src/components/iconify'

const MotionBox = motion(Box)

export default function WishlistView() {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const { isAuthenticated, user } = useSelector((state) => state.auth)
	const [wishlist, setWishlist] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchWishlist = async () => {
			try {
				setLoading(true)
				if (isAuthenticated) {
					const { data } = await axios.get('/api/wishlist/')
					setWishlist(data.products)
				}
			} catch (error) {
				console.error('Error fetching wishlist:', error)
				setError('Failed to load wishlist. Please try again later.')
			} finally {
				setLoading(false)
			}
		}

		fetchWishlist()
	}, [user])

	const handleRemoveItem = async (itemId) => {
		try {
			await axios.delete(`/api/wishlist/${itemId}`)
			setWishlist(wishlist.filter((item) => item._id !== itemId))
		} catch (error) {
			console.error('Error removing item:', error)
			setError('Failed to remove item. Please try again.')
		}
	}

	if (error) {
		return (
			<Container sx={{ py: 2 }}>
				<Alert
					severity="error"
					sx={{ mb: 2 }}>
					{error}
				</Alert>
			</Container>
		)
	}

	return (
		<Container
			maxWidth="xl"
			sx={{ py: isMobile ? 2 : 4 }}>
			<Stack spacing={isMobile ? 2 : 3}>
				<Typography
					variant={isMobile ? 'h4' : 'h3'}
					sx={{ fontWeight: 800 }}>
					My Wishlist
					<Typography
						component="span"
						color="text.secondary"
						sx={{
							ml: 1,
							fontWeight: 400,
							fontSize: isMobile ? '0.875rem' : 'inherit',
						}}>
						({wishlist.length} items)
					</Typography>
				</Typography>

				{loading ? (
					<Grid
						container
						spacing={isMobile ? 2 : 3}>
						{[...Array(6)].map((_, index) => (
							<Grid
								item
								xs={6}
								sm={6}
								md={4}
								key={index}>
								<Skeleton
									variant="rounded"
									height={isMobile ? 200 : 320}
								/>
							</Grid>
						))}
					</Grid>
				) : wishlist.length > 0 ? (
					<Grid
						container
						spacing={isMobile ? 2 : 3}>
						{wishlist?.map((item) => (
							<Grid
								item
								xs={6}
								sm={6}
								md={4}
								lg={3}
								key={item._id}>
								<MotionBox
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									whileHover={
										!isMobile ? { scale: 1.02 } : {}
									}
									sx={{
										p: isMobile ? 1.5 : 2.5,
										height: '100%',
										borderRadius: 2,
										border: '1px solid',
										borderColor: 'divider',
										transition: 'all 0.3s ease',
										backgroundColor: 'background.paper',
										'&:hover': {
											boxShadow: !isMobile
												? theme.shadows[6]
												: 'none',
											borderColor: !isMobile
												? 'transparent'
												: 'divider',
										},
									}}>
									<Stack
										spacing={isMobile ? 1.5 : 2.5}
										sx={{ height: '100%' }}>
										<Box
											component="img"
											src={item.image}
											alt={item.name}
											sx={{
												width: '100%',
												height: isMobile ? 120 : 240,
												objectFit: 'contain',
												borderRadius: 1,
												backgroundColor:
													'background.default',
												p: 1,
											}}
										/>
										<Stack spacing={1}>
											<Typography
												variant={
													isMobile
														? 'subtitle1'
														: 'h6'
												}
												sx={{
													fontWeight: 700,
													lineHeight: 1.3,
													fontSize: isMobile
														? '0.875rem'
														: '1rem',
												}}>
												{item.name}
											</Typography>
											<Stack
												direction="row"
												justifyContent="space-between"
												alignItems="center">
												<Typography
													variant={
														isMobile ? 'h6' : 'h5'
													}
													color="primary"
													sx={{
														fontWeight: 800,
														fontSize: isMobile
															? '1rem'
															: '1.25rem',
													}}>
													${item.price}
												</Typography>
												<IconButton
													onClick={() =>
														handleRemoveItem(
															item._id
														)
													}
													size={
														isMobile
															? 'small'
															: 'medium'
													}
													sx={{
														color: 'error.main',
														'&:hover': {
															backgroundColor:
																'error.light',
														},
													}}>
													<Iconify
														icon="mdi:heart-remove"
														width={
															isMobile ? 20 : 24
														}
													/>
												</IconButton>
											</Stack>
										</Stack>
										<Button
											fullWidth
											variant="contained"
											size={isMobile ? 'small' : 'large'}
											startIcon={
												<Iconify
													icon="mdi:cart-plus"
													width={isMobile ? 16 : 20}
												/>
											}
											sx={{
												mt: 'auto',
												fontWeight: 700,
												borderRadius: 1,
												py: isMobile ? 0.75 : 1.5,
												textTransform: 'none',
												fontSize: isMobile
													? '0.75rem'
													: '0.875rem',
											}}>
											Add to Cart
										</Button>
									</Stack>
								</MotionBox>
							</Grid>
						))}
					</Grid>
				) : (
					<Box
						sx={{
							height: isMobile ? '50vh' : '60vh',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							textAlign: 'center',
							p: isMobile ? 2 : 4,
						}}>
						<Iconify
							icon="mdi:heart-outline"
							width={isMobile ? 60 : 80}
							sx={{ color: 'text.disabled', mb: 2 }}
						/>
						<Typography
							variant={isMobile ? 'h6' : 'h5'}
							sx={{ mb: 1 }}>
							Your Wishlist is Empty
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
							Start adding items you love by clicking the heart
							icon
						</Typography>
					</Box>
				)}
			</Stack>
		</Container>
	)
}
