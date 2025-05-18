import { useState } from 'react'
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
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material'
import PaymentIcon from '@mui/icons-material/Payment'
import { CiMoneyBill } from 'react-icons/ci'

import axios from '../../utils/axios'
import { selectCartDetails } from '../../store/cartSlice'

export default function CheckoutPageView() {
	const { isAuthenticated, user } = useSelector((state) => state.auth)
	const { items, totalPrice } = useSelector((state) =>
		selectCartDetails(state, user?._id)
	)
	const [openDialog, setOpenDialog] = useState(false)

	const handleEsewaPayment = async () => {
		try {
			const { data } = await axios.post('/api/pay-esewa', {
				items: items,
			})

			const productsData = items.map((item) => ({
				name: item.name,
				qty: item.qty,
				price: item.price,
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
			const { data } = await axios.post('/api/pay-khalti', {
				items: items,
			})

			console.log(data)

			const productsData = items.map((item) => ({
				name: item.name,
				qty: item.qty,
				price: item.price,
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

	const handleOpenDialog = () => {
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
	}

	const handleCashOnDelivery = () => {
		toast.success('Order placed successfully with Cash on Delivery!')
		setOpenDialog(false)
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
					{items.map((item) => (
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
											Price: Rs. {item.price.toFixed(2)}
										</Typography>
										<Typography
											variant="body2"
											sx={{ mt: 1 }}>
											Total: Rs.
											{(item.qty * item.price).toFixed(2)}
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
								Total: Rs. {totalPrice.toFixed(2)}
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
								onClick={handleOpenDialog}>
								Other Payment Method
							</Button>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}>
				<DialogTitle>Select Payment Method</DialogTitle>
				<DialogContent>
					<Typography
						variant="body1"
						sx={{ mb: 2 }}>
						Please choose your preferred payment method
					</Typography>
					<Button
						fullWidth
						variant="contained"
						color="primary"
						startIcon={<CiMoneyBill />}
						onClick={handleCashOnDelivery}
						sx={{ mt: 2 }}>
						Cash on Delivery
					</Button>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</Container>
	)
}
