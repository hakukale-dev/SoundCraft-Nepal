import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import {
	Grid,
	Card,
	CardMedia,
	Typography,
	Button,
	IconButton,
	Box,
	Stack,
	Container,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useTheme } from '@mui/material/styles'

import {
	increaseQty,
	decreaseQty,
	removeFromCart,
	clearCart,
	addToCart,
} from '../../store/cartSlice'
import axiosInstance from '../../utils/axios'

export default function CartPageView() {
	const theme = useTheme()
	const dispatch = useDispatch()
	const cartItems = useSelector((state) => state.cart)
	const [recommendedItems, setRecommendedItems] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const total = cartItems.reduce(
		(sum, item) => sum + item.qty * item.price_per,
		0
	)
	const navigate = useNavigate()

	useEffect(() => {
		fetchRecommendedItems()
	}, [])

	const fetchRecommendedItems = async () => {
		try {
			setError(null)
			setIsLoading(true)
			const response = await axiosInstance().get('api/recommendations')
			setRecommendedItems(response.data)
		} catch (error) {
			console.error('Error fetching recommended items:', error)
			setError(
				error.response?.data?.message ||
					'Failed to load recommendations'
			)
		} finally {
			setIsLoading(false)
		}
	}

	const handleAddToCart = (item) => {
		dispatch(addToCart(item))
		toast.success('Items added to cart!')
	}

	const handleClearCart = () => {
		dispatch(clearCart())
		toast.info('Cart Cleared')
	}

	return (
		<Container
			maxWidth="xl"
			sx={{ mt: '100px', px: { lg: 20 } }}>
			<Grid
				container
				spacing={3}>
				<Grid
					item
					xs={12}
					md={8}>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
						mb={5}>
						<Typography
							variant="h4"
							fontFamily={theme.typography.fontFamily}
							color={theme.palette.primary.main}
							sx={{ fontSize: '2.5rem', fontWeight: 600 }}>
							Shopping Cart
						</Typography>
						<Typography
							variant="body1"
							color="text.secondary">
							{cartItems.length} item
							{cartItems.length !== 1 && 's'} in cart
						</Typography>
					</Stack>

					{cartItems.length === 0 ? (
						<Box sx={{ textAlign: 'center', py: 10 }}>
							<Typography
								variant="h6"
								color="text.secondary">
								Your cart is empty
							</Typography>
						</Box>
					) : (
						<>
							{cartItems.map((item) => (
								<Card
									key={item.id}
									sx={{
										mb: 2,
										p: 3,
										transition: 'all 0.3s ease-in-out',
										border: `1px solid ${theme.palette.divider}`,
										'&:hover': {
											boxShadow: theme.shadows[6],
											transform: 'translateY(-2px)',
										},
									}}>
									<Grid
										container
										alignItems="center"
										spacing={3}>
										<Grid
											item
											xs={12}
											sm={3}>
											<CardMedia
												component="img"
												image={item.thumbnail}
												alt={item.name}
												sx={{
													height: 150,
													objectFit: 'contain',
													borderRadius: 2,
													bgcolor:
														theme.palette.grey[100],
												}}
											/>
										</Grid>
										<Grid
											item
											xs={12}
											sm={5}>
											<Typography
												variant="h6"
												fontFamily={
													theme.typography.fontFamily
												}
												mb={1}>
												{item.name}
											</Typography>
											<Typography
												variant="body1"
												color="text.secondary">
												Unit Price: $
												{item.price_per.toLocaleString(
													undefined,
													{
														maximumFractionDigits: 2,
													}
												)}
											</Typography>
										</Grid>
										<Grid
											item
											xs={12}
											sm={2}>
											<Box
												display="flex"
												alignItems="center"
												justifyContent="center"
												sx={{
													border: `1px solid ${theme.palette.divider}`,
													borderRadius: 2,
													p: 1,
													width: 'fit-content',
												}}>
												<IconButton
													onClick={() =>
														dispatch(
															decreaseQty(item.id)
														)
													}
													disabled={item.qty === 1}
													size="small">
													<RemoveIcon fontSize="small" />
												</IconButton>
												<Typography
													mx={2}
													fontFamily={
														theme.typography
															.fontFamily
													}
													fontWeight={500}>
													{item.qty}
												</Typography>
												<IconButton
													onClick={() =>
														dispatch(
															increaseQty(item.id)
														)
													}
													size="small">
													<AddIcon fontSize="small" />
												</IconButton>
											</Box>
											<Typography
												variant="subtitle1"
												fontFamily={
													theme.typography.fontFamily
												}
												fontWeight={600}
												sx={{
													mt: 1,
													textAlign: 'center',
												}}>
												$
												{(
													item.qty * item.price_per
												).toLocaleString(undefined, {
													maximumFractionDigits: 2,
												})}
											</Typography>
										</Grid>
										<Grid
											item
											xs={12}
											sm={2}>
											<Stack
												direction="row"
												justifyContent="flex-end">
												<IconButton
													onClick={() =>
														dispatch(
															removeFromCart(
																item.id
															)
														)
													}
													sx={{
														color: theme.palette
															.error.main,
													}}>
													<DeleteIcon fontSize="small" />
												</IconButton>
											</Stack>
										</Grid>
									</Grid>
								</Card>
							))}

							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									mt: 5,
									p: 3,
									bgcolor: theme.palette.grey[100],
									borderRadius: 2,
								}}>
								<Stack
									direction="row"
									spacing={2}>
									<Button
										variant="outlined"
										color="error"
										onClick={handleClearCart}
										sx={{ px: 5, fontWeight: 600 }}>
										Clear Cart
									</Button>
									<Button
										variant="contained"
										onClick={() => navigate('/checkout')}
										sx={{ px: 5, fontWeight: 600 }}>
										Checkout
									</Button>
								</Stack>
								<Typography
									variant="h5"
									fontFamily={theme.typography.fontFamily}
									color={theme.palette.primary.main}
									fontWeight={700}>
									Total: $
									{total.toLocaleString(undefined, {
										maximumFractionDigits: 2,
									})}
								</Typography>
							</Box>
						</>
					)}
				</Grid>

				<Grid
					item
					xs={12}
					md={4}>
					<Card sx={{ p: 3, position: 'sticky', top: 100 }}>
						<Typography
							variant="h5"
							fontFamily={theme.typography.fontFamily}
							color={theme.palette.primary.main}
							mb={3}>
							Recommended Items
						</Typography>
						<Stack spacing={3}>
							{isLoading ? (
								<Typography color="text.secondary">
									Loading recommendations...
								</Typography>
							) : error ? (
								<Typography color="error">{error}</Typography>
							) : (
								recommendedItems.map((item) => (
									<Card
										key={item.equipment_id}
										sx={{ p: 2, borderRadius: 2 }}>
										<CardMedia
											component="img"
											image={item.thumbnail}
											alt={item.name}
											sx={{
												height: 120,
												objectFit: 'contain',
											}}
										/>
										<Box sx={{ mt: 2 }}>
											<Typography
												variant="subtitle1"
												fontFamily={
													theme.typography.fontFamily
												}>
												{item.name}
											</Typography>
											<Typography
												variant="body1"
												color="text.secondary"
												mt={1}>
												$
												{item.price_per.toLocaleString()}
											</Typography>
											<Button
												fullWidth
												variant="contained"
												sx={{ mt: 2 }}
												onClick={() =>
													handleAddToCart(item)
												}>
												Add to Cart
											</Button>
										</Box>
									</Card>
								))
							)}
						</Stack>
					</Card>
				</Grid>
			</Grid>
		</Container>
	)
}
