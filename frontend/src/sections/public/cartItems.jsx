import { useEffect, useState } from 'react'
import { useSelector, useDispatch, useStore } from 'react-redux'
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
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	useMediaQuery,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useTheme } from '@mui/material/styles'

import {
	removeFromCart,
	clearCart,
	addToCart,
	selectCartDetails,
	decreaseQty,
	increaseQty,
	selectCanAddToCart,
} from '../../store/cartSlice'
import axios from '../../utils/axios'

export default function CartPageView() {
	const theme = useTheme()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const store = useStore()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	const [recommendedItems, setRecommendedItems] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

	const { isAuthenticated, user } = useSelector((state) => state.auth)
	const { items, totalPrice } = useSelector((state) =>
		selectCartDetails(state, user?._id)
	)

	useEffect(() => {
		const fetchRecommendedItems = async () => {
			try {
				setError(null)
				setIsLoading(true)
				const response = await axios.get('api/recommendations')
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
		fetchRecommendedItems()
	}, [])

	const handleAddToCart = (item) => {
		try {
			if (!isAuthenticated) {
				navigate('/login')
				return
			}

			if (!item?._id || !item?.price) {
				toast.error('Invalid product information', {
					position: isMobile ? 'top-center' : 'bottom-right',
				})
				return
			}

			const currentState = store.getState()
			const canAdd = selectCanAddToCart(
				currentState,
				user._id,
				item._id,
				1
			)

			if (!canAdd) {
				toast.error('This item is out of stock', {
					position: isMobile ? 'top-center' : 'bottom-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: 'light',
				})
				return
			}

			dispatch(
				addToCart({
					userId: user._id,
					product: {
						_id: item._id,
						name: item.name,
						price: item.price,
						image: item.image,
						stock: item.stock,
					},
				})
			)
			toast.success('Item added to cart!')
		} catch (error) {
			toast.error('Failed to add item to cart')
			console.error('Add to cart error:', error)
		}
	}

	const handleIncreaseQty = (itemId) => {
		const item = items.find((item) => item._id === itemId)
		if (!item) return

		const currentState = store.getState()
		const canAdd = selectCanAddToCart(currentState, user._id, item._id, 1)

		if (!canAdd) {
			toast.error('Cannot add more items than available stock', {
				position: isMobile ? 'top-center' : 'bottom-right',
			})
			return
		}

		dispatch(
			increaseQty({
				userId: user._id,
				productId: itemId,
			})
		)
	}

	const handleDecreaseQty = (itemId) => {
		const item = items.find((item) => item._id === itemId)
		if (!item) return

		if (item.qty <= 1) {
			toast.error('Quantity cannot be less than 1', {
				position: isMobile ? 'top-center' : 'bottom-right',
			})
			return
		}

		dispatch(
			decreaseQty({
				userId: user._id,
				productId: itemId,
			})
		)
	}

	const handleRemoveItem = (itemId) => {
		dispatch(
			removeFromCart({
				userId: user._id,
				productId: itemId,
			})
		)
		toast.success('Item removed from cart', {
			position: isMobile ? 'top-center' : 'bottom-right',
		})
	}

	const handleCheckout = () => {
		if (items.length === 0) {
			toast.error('Your cart is empty', {
				position: isMobile ? 'top-center' : 'bottom-right',
			})
			return
		}
		navigate('/checkout')
	}

	const handleClearCart = () => {
		setOpenConfirmDialog(true)
	}

	const handleConfirmClearCart = () => {
		dispatch(clearCart({ userId: user?._id }))
		setOpenConfirmDialog(false)
		toast.success('Cart cleared successfully!', {
			position: isMobile ? 'top-center' : 'bottom-right',
		})
	}

	const handleCloseConfirmDialog = () => {
		setOpenConfirmDialog(false)
	}

	return (
		<Container
			maxWidth="xl"
			sx={{
				mt: isMobile ? '80px' : '100px',
				px: isMobile ? 2 : { lg: 20 },
			}}>
			<Grid
				container
				spacing={3}>
				<Grid
					item
					xs={12}
					md={8}>
					<Stack
						direction={isMobile ? 'column' : 'row'}
						alignItems={isMobile ? 'flex-start' : 'center'}
						justifyContent="space-between"
						mb={5}
						spacing={isMobile ? 2 : 0}>
						<Typography
							variant={isMobile ? 'h5' : 'h4'}
							fontFamily={theme.typography.fontFamily}
							color={theme.palette.primary.main}
							sx={{
								fontSize: isMobile ? '1.8rem' : '2.5rem',
								fontWeight: 600,
							}}>
							Shopping Cart
						</Typography>
						<Typography
							variant="body1"
							color="text.secondary">
							{items.length} item{items.length !== 1 && 's'} in
							cart
						</Typography>
					</Stack>

					{items.length === 0 ? (
						<Box sx={{ textAlign: 'center', py: 10 }}>
							<Typography
								variant="h6"
								color="text.secondary">
								Your cart is empty
							</Typography>
						</Box>
					) : (
						<>
							{items.map((item) => (
								<Card
									key={item._id}
									sx={{
										mb: 2,
										p: isMobile ? 2 : 3,
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
										spacing={2}>
										<Grid
											item
											xs={12}
											sm={3}>
											<CardMedia
												component="img"
												image={item.image}
												alt={item.name}
												sx={{
													height: isMobile
														? 100
														: 150,
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
												variant={
													isMobile
														? 'subtitle1'
														: 'h6'
												}
												fontFamily={
													theme.typography.fontFamily
												}
												mb={1}>
												{item.name}
											</Typography>
											<Typography
												variant="body1"
												color="text.secondary">
												Unit Price: Rs.
												{item.price.toLocaleString(
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
											sm={5}>
											<Typography
												variant={
													isMobile
														? 'subtitle1'
														: 'h6'
												}
												fontFamily={
													theme.typography.fontFamily
												}
												mb={1}>
												{item.name}
											</Typography>
											<Typography
												variant={
													isMobile ? 'body2' : 'body1'
												}
												color="text.secondary">
												Unit Price: Rs.
												{item.price.toLocaleString(
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
												justifyContent={
													isMobile
														? 'flex-start'
														: 'center'
												}
												sx={{
													border: `1px solid ${theme.palette.divider}`,
													borderRadius: 2,
													p: 1,
													width: 'fit-content',
													ml: isMobile ? 0 : 'auto',
													mr: isMobile ? 0 : 'auto',
												}}>
												<IconButton
													onClick={() =>
														handleDecreaseQty(
															item._id
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
														handleIncreaseQty(
															item._id
														)
													}
													size="small">
													<AddIcon fontSize="small" />
												</IconButton>
											</Box>
											<Typography
												variant={
													isMobile
														? 'body1'
														: 'subtitle1'
												}
												fontFamily={
													theme.typography.fontFamily
												}
												fontWeight={600}
												sx={{
													mt: 1,
													textAlign: isMobile
														? 'left'
														: 'center',
												}}>
												Rs.
												{(
													item.qty * item.price
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
												justifyContent={
													isMobile
														? 'flex-start'
														: 'flex-end'
												}>
												<IconButton
													onClick={() =>
														handleRemoveItem(
															item._id
														)
													}
													sx={{
														color: theme.palette
															.error.main,
														ml: isMobile
															? 0
															: 'auto',
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
									flexDirection: isMobile ? 'column' : 'row',
									justifyContent: 'space-between',
									alignItems: isMobile ? 'stretch' : 'center',
									mt: 5,
									p: 3,
									bgcolor: theme.palette.grey[100],
									borderRadius: 2,
									gap: isMobile ? 2 : 0,
								}}>
								<Stack
									direction={isMobile ? 'column' : 'row'}
									spacing={2}
									width={isMobile ? '100%' : 'auto'}>
									<Button
										variant="outlined"
										color="error"
										onClick={handleClearCart}
										sx={{
											px: 5,
											fontWeight: 600,
											width: isMobile ? '100%' : 'auto',
										}}>
										Clear Cart
									</Button>
									<Button
										variant="contained"
										onClick={handleCheckout}
										sx={{
											px: 5,
											fontWeight: 600,
											width: isMobile ? '100%' : 'auto',
										}}>
										Checkout
									</Button>
								</Stack>
								<Typography
									variant={isMobile ? 'h6' : 'h5'}
									fontFamily={theme.typography.fontFamily}
									color={theme.palette.primary.main}
									fontWeight={700}
									sx={{
										mt: isMobile ? 2 : 0,
										textAlign: isMobile
											? 'center'
											: 'right',
									}}>
									Total: Rs.
									{totalPrice.toLocaleString(undefined, {
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
					<Card
						sx={{
							p: 3,
							position: isMobile ? 'static' : 'sticky',
							top: isMobile ? 0 : 100,
							mt: isMobile ? 4 : 0,
						}}>
						<Typography
							variant={isMobile ? 'h6' : 'h5'}
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
										key={item._id}
										sx={{ p: 2, borderRadius: 2 }}>
										<CardMedia
											component="img"
											image={item.image}
											alt={item.name}
											sx={{
												height: isMobile ? 100 : 120,
												objectFit: 'contain',
											}}
										/>
										<Box sx={{ mt: 2 }}>
											<Typography
												variant={
													isMobile
														? 'body1'
														: 'subtitle1'
												}
												fontFamily={
													theme.typography.fontFamily
												}>
												{item.name}
											</Typography>
											<Typography
												variant={
													isMobile ? 'body2' : 'body1'
												}
												color="text.secondary"
												mt={1}>
												Rs.{' '}
												{item.price.toLocaleString()}
											</Typography>
											<Button
												fullWidth
												variant="contained"
												size={
													isMobile
														? 'small'
														: 'medium'
												}
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

			{/* Clear Cart Confirmation Dialog */}
			<Dialog
				open={openConfirmDialog}
				onClose={handleCloseConfirmDialog}
				fullScreen={isMobile}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle
					id="alert-dialog-title"
					sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
					Clear Cart Confirmation
				</DialogTitle>
				<DialogContent>
					<Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
						Are you sure you want to clear your cart? This action
						cannot be undone.
					</Typography>
				</DialogContent>
				<DialogActions
					sx={{
						flexDirection: isMobile ? 'column' : 'row',
						gap: isMobile ? 1 : 0,
						padding: isMobile ? 2 : 1,
					}}>
					<Button
						onClick={handleCloseConfirmDialog}
						color="primary"
						fullWidth={isMobile}
						size={isMobile ? 'medium' : 'small'}>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmClearCart}
						color="error"
						fullWidth={isMobile}
						size={isMobile ? 'medium' : 'small'}
						autoFocus>
						Clear Cart
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	)
}
