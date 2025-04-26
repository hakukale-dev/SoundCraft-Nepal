import { useTheme } from '@mui/material/styles'
import { CheckCircle } from '@mui/icons-material'
import {
	Container,
	Stack,
	Button,
	Typography,
	Card,
	Divider,
	Box,
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { clearCart } from '../../store/cartSlice'

function PaymentSuccessView() {
	const theme = useTheme()
	const navigate = useNavigate()
	const location = useLocation()
	const dispatch = useDispatch()

	const searchParams = new URLSearchParams(location.search)
	const transactionCode = searchParams.get('transaction_code')
	const totalAmount = searchParams.get('total_amount')
	const transactionUUID = searchParams.get('transaction_uuid')
	const products = JSON.parse(sessionStorage.getItem('products')) || []
	const { isAuthenticated, user } = useSelector((state) => state.auth)

	useEffect(() => {
		dispatch(clearCart(user?._id))
	}, [user])

	return (
		<Container sx={{ py: 5 }}>
			<Card
				sx={{
					p: 5,
					maxWidth: 720,
					mx: 'auto',
					backgroundColor: theme.palette.background.paper,
					boxShadow: `0 4px 12px ${theme.palette.primary.main}25`,
				}}>
				<Stack
					alignItems="center"
					spacing={3}>
					<CheckCircle
						sx={{
							color: theme.palette.success.main,
							fontSize: 80,
						}}
					/>

					<Typography
						variant="h4"
						align="center"
						sx={{
							color: theme.palette.success.main,
							fontWeight: 700,
						}}>
						Payment Successful!
					</Typography>

					<Typography
						variant="body1"
						align="center">
						Thank you for your purchase. Your order has been
						processed successfully.
					</Typography>

					<Divider sx={{ width: '100%' }} />

					<Stack
						spacing={1}
						sx={{ width: '100%' }}>
						<Typography variant="h6">Order Details</Typography>
						<Stack
							direction="row"
							justifyContent="space-between">
							<Typography variant="body2">
								Order Number:
							</Typography>
							<Typography variant="body2">
								#{transactionUUID}
							</Typography>
						</Stack>
						<Stack
							direction="row"
							justifyContent="space-between">
							<Typography variant="body2">
								Total Amount:
							</Typography>
							<Typography variant="body2">
								Rs. {parseFloat(totalAmount).toLocaleString()}
							</Typography>
						</Stack>
					</Stack>

					<Box sx={{ width: '100%', mt: 3 }}>
						<Typography
							variant="h6"
							gutterBottom>
							Items Purchased
						</Typography>
						{products.map((product, index) => (
							<Stack
								key={index}
								direction="row"
								justifyContent="space-between"
								sx={{ mb: 1 }}>
								<Typography variant="body2">
									{product.name} (Qty: {product.qty})
								</Typography>
								<Typography variant="body2">
									Rs.{' '}
									{(
										product.qty * product.price
									).toLocaleString()}
								</Typography>
							</Stack>
						))}
					</Box>

					<Button
						fullWidth
						variant="contained"
						size="large"
						onClick={() => navigate('/')}
						sx={{
							mt: 3,
							bgcolor: theme.palette.primary.main,
							'&:hover': {
								bgcolor: theme.palette.primary.dark,
							},
						}}>
						Continue Shopping
					</Button>
				</Stack>
			</Card>
		</Container>
	)
}

export default PaymentSuccessView
