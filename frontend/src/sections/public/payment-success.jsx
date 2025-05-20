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
	useMediaQuery,
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { clearCart } from '../../store/cartSlice'

function PaymentSuccessView() {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
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
		dispatch(clearCart({ userId: user?._id || null }))
	}, [user])

	return (
		<Container sx={{ py: isMobile ? 3 : 5 }}>
			<Card
				sx={{
					p: isMobile ? 2 : 5,
					maxWidth: 720,
					mx: 'auto',
					backgroundColor: theme.palette.background.paper,
					boxShadow: `0 4px 12px ${theme.palette.primary.main}25`,
				}}>
				<Stack
					alignItems="center"
					spacing={isMobile ? 2 : 3}>
					<CheckCircle
						sx={{
							color: theme.palette.success.main,
							fontSize: isMobile ? 60 : 80,
						}}
					/>

					<Typography
						variant={isMobile ? 'h5' : 'h4'}
						align="center"
						sx={{
							color: theme.palette.success.main,
							fontWeight: 700,
						}}>
						Payment Successful!
					</Typography>

					<Typography
						variant={isMobile ? 'body2' : 'body1'}
						align="center">
						Thank you for your purchase. Your order has been
						processed successfully.
					</Typography>

					<Divider sx={{ width: '100%' }} />

					<Stack
						spacing={1}
						sx={{ width: '100%' }}>
						<Typography variant={isMobile ? 'subtitle1' : 'h6'}>
							Order Details
						</Typography>
						<Stack
							direction="row"
							justifyContent="space-between">
							<Typography
								variant={isMobile ? 'caption' : 'body2'}>
								Order Number:
							</Typography>
							<Typography
								variant={isMobile ? 'caption' : 'body2'}>
								#{transactionUUID}
							</Typography>
						</Stack>
						<Stack
							direction="row"
							justifyContent="space-between">
							<Typography
								variant={isMobile ? 'caption' : 'body2'}>
								Total Amount:
							</Typography>
							<Typography
								variant={isMobile ? 'caption' : 'body2'}>
								Rs. {parseFloat(totalAmount).toLocaleString()}
							</Typography>
						</Stack>
					</Stack>

					<Box sx={{ width: '100%', mt: 3 }}>
						<Typography
							variant={isMobile ? 'subtitle1' : 'h6'}
							gutterBottom>
							Items Purchased
						</Typography>
						{products.map((product, index) => (
							<Stack
								key={index}
								direction="row"
								justifyContent="space-between"
								sx={{ mb: 1 }}>
								<Typography
									variant={isMobile ? 'caption' : 'body2'}>
									{product.name} (Qty: {product.qty})
								</Typography>
								<Typography
									variant={isMobile ? 'caption' : 'body2'}>
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
						size={isMobile ? 'medium' : 'large'}
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
