import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
	Typography,
	Container,
	Card,
	CardContent,
	Grid,
	Divider,
	CircularProgress,
	Alert,
	Box,
	Chip,
	useTheme,
} from '@mui/material'
import axiosInstance from '../../utils/axios'
import { EventNote, Payments, ShoppingBag, Info } from '@mui/icons-material'

function PurchaseHistoryView() {
	const [billingHistory, setBillingHistory] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const user = useSelector((state) => state.auth.user)
	const theme = useTheme()

	useEffect(() => {
		const fetchPurchaseHistory = async () => {
			try {
				const { data } = await axiosInstance().get(
					'/api/billing-history'
				)
				setBillingHistory(data)
				setError(null)
			} catch (err) {
				setError(
					err.response?.data?.message ||
						'Failed to load purchase history'
				)
			} finally {
				setLoading(false)
			}
		}
		fetchPurchaseHistory()
	}, [])

	const formatDate = (dateString) => {
		const options = {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}
		return new Date(dateString).toLocaleDateString(undefined, options)
	}

	if (loading) {
		return (
			<Container
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '50vh',
					flexDirection: 'column',
					gap: 2,
				}}>
				<CircularProgress
					thickness={5}
					size={60}
				/>
				<Typography
					variant="body1"
					color="text.secondary">
					Loading purchase history...
				</Typography>
			</Container>
		)
	}

	if (error) {
		return (
			<Container sx={{ py: 5 }}>
				<Alert
					severity="error"
					icon={<Info fontSize="large" />}
					sx={{
						borderRadius: 2,
						alignItems: 'center',
						fontSize: '1.1rem',
					}}>
					{error}
				</Alert>
			</Container>
		)
	}

	return (
		<Container sx={{ py: 5, maxWidth: { xl: 1400 } }}>
			<Box
				sx={{
					mb: 6,
					textAlign: 'center',
					'& h3': {
						fontWeight: 700,
						letterSpacing: '-0.5px',
						position: 'relative',
						display: 'inline-block',
						'&:after': {
							content: '""',
							position: 'absolute',
							bottom: -8,
							left: '50%',
							transform: 'translateX(-50%)',
							width: 60,
							height: 4,
							backgroundColor: theme.palette.primary.main,
							borderRadius: 2,
						},
					},
				}}>
				<Typography
					variant="h3"
					gutterBottom>
					<ShoppingBag
						sx={{
							fontSize: 40,
							verticalAlign: 'middle',
							mr: 2,
							color: theme.palette.primary.main,
						}}
					/>
					Purchase History
				</Typography>
			</Box>

			{billingHistory.length === 0 ? (
				<Box
					sx={{
						textAlign: 'center',
						p: 8,
						backgroundColor: theme.palette.background.paper,
						borderRadius: 3,
						boxShadow: 1,
					}}>
					<Typography
						variant="h6"
						color="text.secondary">
						No purchases found
					</Typography>
				</Box>
			) : (
				billingHistory.map((purchase) => (
					<Card
						key={purchase._id}
						sx={{
							mb: 3,
							boxShadow: 3,
							borderRadius: 3,
							transition: 'transform 0.2s',
							'&:hover': {
								transform: 'translateY(-2px)',
							},
						}}>
						<CardContent sx={{ p: 3 }}>
							<Grid
								container
								spacing={3}>
								<Grid
									item
									xs={12}
									md={6}>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: 2,
										}}>
										<EventNote color="primary" />
										<Box>
											<Typography
												variant="h6"
												fontWeight={600}>
												{formatDate(purchase.createdAt)}
											</Typography>
											<Typography
												variant="body2"
												color="textSecondary">
												<Payments
													fontSize="small"
													sx={{
														verticalAlign: 'middle',
														mr: 1,
													}}
												/>
												{`${purchase.payment_method
													.charAt(0)
													.toUpperCase()}${purchase.payment_method.slice(
													1
												)}`}
											</Typography>
										</Box>
									</Box>
								</Grid>

								<Grid
									item
									xs={6}
									md={3}>
									<Typography
										variant="subtitle1"
										fontWeight={600}>
										Total: Rs. {purchase.amount?.toFixed(2)}
									</Typography>
									<Typography
										variant="caption"
										color="textSecondary">
										Ref: {purchase.payment_reference_id}
									</Typography>
								</Grid>

								<Grid
									item
									xs={6}
									md={3}
									sx={{ textAlign: 'right' }}>
									<Chip
										label={`${purchase.status
											.charAt(0)
											.toUpperCase()}${purchase.status.slice(
											1
										)}`}
										sx={{
											px: 2,
											py: 1,
											fontSize: '0.9rem',
											fontWeight: 600,
											backgroundColor:
												purchase.status === 'completed'
													? theme.palette.success
															.light
													: purchase.status ===
													  'failed'
													? theme.palette.error.light
													: theme.palette.warning
															.light,
											color:
												purchase.status === 'completed'
													? theme.palette.success
															.contrastText
													: purchase.status ===
													  'failed'
													? theme.palette.error
															.contrastText
													: theme.palette.warning
															.contrastText,
										}}
									/>
								</Grid>
							</Grid>

							<Divider sx={{ my: 3, borderStyle: 'dashed' }} />

							<Box
								sx={{
									border: '1px solid grey',
									borderRadius: 2,
									p: 2,
									mb: 2,
								}}>
								<Typography
									variant="subtitle1"
									fontWeight={600}
									sx={{
										borderBottom: '1px solid grey',
										mb: 2,
									}}>
									Purchased Items
								</Typography>

								{purchase.items.map((item, index) => (
									<Box
										key={index}
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											py: 1,
											px: 2,
											backgroundColor:
												theme.palette.background.paper,
											borderRadius: 1,
											mb: 1,
											'&:last-child': { mb: 0 },
										}}>
										<Typography
											variant="body2"
											fontWeight={500}>
											{item.product_id.name}
										</Typography>
										<Box sx={{ display: 'flex', gap: 3 }}>
											<Typography
												variant="body2"
												color="textSecondary">
												Qty: {item.quantity}
											</Typography>
											<Typography
												variant="body2"
												fontWeight={600}>
												Rs.{' '}
												{(
													item.price_per *
													item.quantity
												).toFixed(2)}
											</Typography>
										</Box>
									</Box>
								))}
							</Box>
						</CardContent>
					</Card>
				))
			)}
		</Container>
	)
}

export default PurchaseHistoryView
