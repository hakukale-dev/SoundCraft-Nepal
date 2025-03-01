import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
	Typography,
	Grid,
	Button,
	Card,
	CardContent,
	Divider,
	Container,
	CardMedia,
} from '@mui/material'
import PaymentIcon from '@mui/icons-material/Payment'

import axiosInstance from '../../utils/axios'
import axios from 'axios'

export default function CheckoutPageView() {
	const cartItems = useSelector((state) => state.cart)
	const total = cartItems.reduce(
		(sum, item) => sum + item.qty * item.price_per,
		0
	)

	const handleEsewaPayment = async () => {
		try {
			const { data } = await axiosInstance().post('/api/pay-esewa', {
				items: cartItems,
			})

			const productsData = cartItems.map((item) => ({
				name: item.name,
				qty: item.qty,
				price_per: item.price_per,
			}))
			sessionStorage.setItem('products', JSON.stringify(productsData))

			// Create hidden form
			const form = document.createElement('form')
			form.method = 'POST'
			form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'

			Object.entries(data.formData).forEach(([key, value]) => {
				const input = document.createElement('input')
				input.type = 'hidden'
				input.name = key
				input.value = value
				form.appendChild(input)
			})

			document.body.appendChild(form)
			form.submit()
		} catch (error) {
			toast.error(
				error.response?.data?.error || 'Payment initiation failed'
			)
		}
	}

	const handleKhaltiPayment = async () => {
		try {
			const { data } = await axiosInstance().post('/api/pay-khalti', {
				items: cartItems,
			})

			console.log(data)

			const productsData = cartItems.map((item) => ({
				name: item.name,
				qty: item.qty,
				price_per: item.price_per,
			}))
			sessionStorage.setItem('products', JSON.stringify(productsData))
			
			window.location.href = data
		} catch (error) {
			toast.error(
				error.response?.data?.error || 'Payment initiation failed'
			)
			console.log(error)
		}
	}

	const handlePlaceOrder = () => {
		console.log('Placing order...')
		alert('Order placed successfully!')
	}

	return (
		<Container maxWidth="xl">
			<Grid
				container
				spacing={3}
				sx={{ p: 4 }}>
				<Grid
					item
					xs={12}
					md={8}>
					<Typography
						variant="h4"
						gutterBottom>
						Order Details
					</Typography>
					{cartItems.map((item) => (
						<Card
							key={item.id}
							sx={{ mb: 2 }}>
							<CardContent>
								<Grid
									container
									spacing={2}>
									<Grid
										item
										xs={4}>
										<CardMedia
											component="img"
											image={item.image}
											alt={item.name}
											sx={{
												height: 100,
												objectFit: 'contain',
											}}
										/>
									</Grid>
									<Grid
										item
										xs={8}>
										<Typography variant="h6">
											{item.name}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary">
											Quantity: {item.qty}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary">
											Price: ${item.price_per.toFixed(2)}
										</Typography>
										<Typography
											variant="body2"
											sx={{ mt: 1 }}>
											Total: $
											{(
												item.qty * item.price_per
											).toFixed(2)}
										</Typography>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					))}
				</Grid>

				<Grid
					item
					xs={12}
					md={4}>
					<Card variant="outlined">
						<CardContent>
							<Typography
								variant="h5"
								gutterBottom>
								Payment Summary
							</Typography>
							<Divider sx={{ my: 2 }} />
							<Typography
								variant="h6"
								sx={{ fontWeight: 'bold' }}>
								Total: ${total.toFixed(2)}
							</Typography>

							<Button
								fullWidth
								variant="contained"
								size="large"
								startIcon={
									<img
										src="esewa-icon.png"
										alt="eSewa"
										style={{ width: 24, height: 24 }}
									/>
								}
								sx={{
									mt: 3,
									bgcolor: '#4ac924',
									'&:hover': { bgcolor: '#3f7f2c' },
								}}
								onClick={handleEsewaPayment}>
								Pay with eSewa
							</Button>
							<Button
								fullWidth
								variant="contained"
								size="large"
								startIcon={
									<img
										src="khalti-icon.png"
										alt="Khalti"
										style={{ width: 24, height: 24 }}
									/>
								}
								sx={{
									mt: 2,
									bgcolor: '#8145cc',
									'&:hover': { bgcolor: '#3d1a68' },
								}}
								onClick={handleKhaltiPayment}>
								Pay with Khalti
							</Button>
							<Button
								fullWidth
								variant="outlined"
								size="large"
								startIcon={<PaymentIcon />}
								sx={{ mt: 2 }}
								onClick={handlePlaceOrder}>
								Other Payment Method
							</Button>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Container>
	)
}
