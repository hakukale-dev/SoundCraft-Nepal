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
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import axios from 'src/utils/axios'
import { useSelector } from 'react-redux'
import Iconify from 'src/components/iconify'

const MotionBox = motion(Box)

export default function WishlistView() {
	const theme = useTheme()
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
			<Container sx={{ py: 4 }}>
				<Alert
					severity="error"
					sx={{ mb: 3 }}>
					{error}
				</Alert>
			</Container>
		)
	}

	return (
		<Container
			maxWidth="xl"
			sx={{ py: 4 }}>
			<Stack spacing={3}>
				<Typography
					variant="h3"
					sx={{ fontWeight: 800 }}>
					My Wishlist
					<Typography
						component="span"
						color="text.secondary"
						sx={{ ml: 1.5, fontWeight: 400 }}>
						({wishlist.length} items)
					</Typography>
				</Typography>

				{loading ? (
					<Grid
						container
						spacing={3}>
						{[...Array(6)].map((_, index) => (
							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								key={index}>
								<Skeleton
									variant="rounded"
									height={320}
								/>
							</Grid>
						))}
					</Grid>
				) : wishlist.length > 0 ? (
					<Grid
						container
						spacing={3}>
						{wishlist?.map((item) => (
							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
								key={item._id}>
								<MotionBox
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									whileHover={{ scale: 1.02 }}
									sx={{
										p: 2.5,
										height: '100%',
										borderRadius: 2.5,
										border: '1px solid',
										borderColor: 'divider',
										transition: 'all 0.3s ease',
										backgroundColor: 'background.paper',
										'&:hover': {
											boxShadow: theme.shadows[6],
											borderColor: 'transparent',
										},
									}}>
									<Stack
										spacing={2.5}
										sx={{ height: '100%' }}>
										<Box
											component="img"
											src={item.image}
											alt={item.name}
											sx={{
												width: '100%',
												height: 240,
												objectFit: 'contain',
												borderRadius: 1.5,
												backgroundColor:
													'background.default',
												p: 2,
											}}
										/>
										<Stack spacing={1.5}>
											<Typography
												variant="h6"
												sx={{
													fontWeight: 700,
													lineHeight: 1.3,
												}}>
												{item.name}
											</Typography>
											<Stack
												direction="row"
												justifyContent="space-between"
												alignItems="center">
												<Typography
													variant="h5"
													color="primary"
													sx={{ fontWeight: 800 }}>
													${item.price}
												</Typography>
												<IconButton
													onClick={() =>
														handleRemoveItem(
															item._id
														)
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
														width={24}
													/>
												</IconButton>
											</Stack>
										</Stack>
										<Button
											fullWidth
											variant="contained"
											size="large"
											startIcon={
												<Iconify icon="mdi:cart-plus" />
											}
											sx={{
												mt: 'auto',
												fontWeight: 700,
												borderRadius: 2,
												py: 1.5,
												textTransform: 'none',
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
							height: '60vh',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							textAlign: 'center',
							p: 4,
						}}>
						<Iconify
							icon="mdi:heart-outline"
							width={80}
							sx={{ color: 'text.disabled', mb: 3 }}
						/>
						<Typography
							variant="h5"
							sx={{ mb: 1.5 }}>
							Your Wishlist is Empty
						</Typography>
						<Typography
							variant="body1"
							color="text.secondary">
							Start adding items you love by clicking the heart
							icon
						</Typography>
					</Box>
				)}
			</Stack>
		</Container>
	)
}
