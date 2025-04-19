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
	Button,
	Skeleton,
	IconButton,
} from '@mui/material'
import axios from '../../utils/axios'
import {
	EventNote,
	Payments,
	ShoppingBag,
	Info,
	Download,
	Receipt,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { styled } from '@mui/material/styles'

const StyledCard = styled(Card)(({ theme }) => ({
	marginBottom: theme.spacing(3),
	borderRadius: '16px',
	boxShadow: theme.shadows[4],
	transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
	'&:hover': {
		transform: 'translateY(-4px)',
		boxShadow: theme.shadows[8],
	},
}))

const StatusChip = styled(Chip)(({ theme, status }) => ({
	fontWeight: 700,
	textTransform: 'uppercase',
	letterSpacing: '0.5px',
	backgroundColor:
		status === 'completed'
			? theme.palette.success.light
			: status === 'failed'
			? theme.palette.error.light
			: theme.palette.warning.light,
	color:
		status === 'completed'
			? theme.palette.success.contrastText
			: status === 'failed'
			? theme.palette.error.contrastText
			: theme.palette.warning.contrastText,
}))

function PurchaseHistoryView() {
	const [billingHistory, setBillingHistory] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [page, setPage] = useState(1)
	const user = useSelector((state) => state.auth.user)
	const theme = useTheme()

	useEffect(() => {
		const fetchPurchaseHistory = async () => {
			try {
				const { data } = await axios.get('/api/billing-history')
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

	const handleDownloadReceipt = (purchaseId) => {
		// Implement receipt download logic
		console.log('Downloading receipt for:', purchaseId)
	}

	if (loading) {
		return (
			<Container sx={{ py: 8 }}>
				<Grid
					container
					spacing={3}>
					{[1, 2, 3].map((item) => (
						<Grid
							item
							xs={12}
							key={item}>
							<Skeleton
								variant="rounded"
								height={200}
								sx={{ borderRadius: 3 }}
							/>
						</Grid>
					))}
				</Grid>
			</Container>
		)
	}

	if (error) {
		return (
			<Container sx={{ py: 5 }}>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}>
					<Alert
						severity="error"
						icon={<Info fontSize="large" />}
						sx={{
							borderRadius: 3,
							alignItems: 'center',
							fontSize: '1.1rem',
							boxShadow: theme.shadows[2],
						}}
						action={
							<Button
								color="inherit"
								size="small"
								onClick={() => window.location.reload()}>
								RETRY
							</Button>
						}>
						{error}
					</Alert>
				</motion.div>
			</Container>
		)
	}

	return (
		<Container sx={{ py: 8, maxWidth: { xl: 1400 } }}>
			<motion.div
				initial={{ y: 20 }}
				animate={{ y: 0 }}>
				<Box sx={{ textAlign: 'center', mb: 8 }}>
					<Typography
						variant="h2"
						sx={{
							fontWeight: 800,
							letterSpacing: '-1px',
							mb: 2,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 2,
						}}>
						<ShoppingBag
							sx={{
								fontSize: 48,
								color: theme.palette.primary.main,
							}}
						/>
						Purchase History
					</Typography>
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{ maxWidth: 600, mx: 'auto' }}>
						Review your past transactions and download receipts
					</Typography>
				</Box>
			</motion.div>

			{billingHistory.length === 0 ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}>
					<Box
						sx={{
							textAlign: 'center',
							p: 8,
							backgroundColor: theme.palette.background.paper,
							borderRadius: 3,
							boxShadow: theme.shadows[2],
						}}>
						<Receipt
							sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }}
						/>
						<Typography
							variant="h6"
							color="text.secondary"
							gutterBottom>
							No purchases found
						</Typography>
						<Typography
							variant="body1"
							color="text.secondary"
							sx={{ mb: 3 }}>
							Your future purchases will appear here
						</Typography>
						<Button
							variant="contained"
							href="/products">
							Browse Products
						</Button>
					</Box>
				</motion.div>
			) : (
				billingHistory.map((purchase, index) => (
					<motion.div
						key={purchase._id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}>
						<StyledCard>
							<CardContent sx={{ p: 4 }}>
								<Grid
									container
									spacing={3}
									alignItems="center">
									<Grid
										item
										xs={12}
										md={6}>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: 3,
											}}>
											<Box
												sx={{
													width: 56,
													height: 56,
													borderRadius: 2,
													bgcolor:
														theme.palette.primary
															.light,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}>
												<Payments
													sx={{
														fontSize: 32,
														color: theme.palette
															.primary.main,
													}}
												/>
											</Box>
											<Box>
												<Typography
													variant="h6"
													fontWeight={700}
													gutterBottom>
													{formatDate(
														purchase.createdAt
													)}
												</Typography>
												<Typography
													variant="body2"
													color="text.secondary">
													Payment Method:{' '}
													{purchase.payment_method}
												</Typography>
											</Box>
										</Box>
									</Grid>

									<Grid
										item
										xs={6}
										md={3}>
										<Typography
											variant="h6"
											fontWeight={700}
											color="primary">
											Rs.{' '}
											{purchase.amount?.toLocaleString()}
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
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: 2,
												justifyContent: 'flex-end',
											}}>
											<StatusChip
												label={purchase.status}
												status={purchase.status}
											/>
											<IconButton
												onClick={() =>
													handleDownloadReceipt(
														purchase._id
													)
												}
												sx={{
													color: 'text.secondary',
												}}>
												<Download />
											</IconButton>
										</Box>
									</Grid>
								</Grid>

								<Divider
									sx={{ my: 3, borderStyle: 'dashed' }}
								/>

								<Box
									sx={{
										bgcolor: 'background.default',
										borderRadius: 2,
										p: 2,
									}}>
									<Typography
										variant="subtitle1"
										fontWeight={600}
										sx={{ mb: 2 }}>
										Purchased Items
									</Typography>
									{purchase.items.map((item, index) => (
										<Box
											key={index}
											sx={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												p: 2,
												borderRadius: 1,
												bgcolor: 'background.paper',
												mb: 1,
												transition:
													'background-color 0.2s',
												'&:hover': {
													bgcolor: 'action.hover',
												},
												'&:last-child': { mb: 0 },
											}}>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													gap: 2,
												}}>
												<Box
													component="img"
													src={item.product_id?.image}
													alt={item.product_id?.name}
													sx={{
														width: 48,
														height: 48,
														borderRadius: 1,
													}}
												/>
												<Box>
													<Typography
														variant="body1"
														fontWeight={600}>
														{item.product_id?.name}
													</Typography>
													<Typography
														variant="body2"
														color="textSecondary">
														SKU:{' '}
														{item.product_id?.sku}
													</Typography>
												</Box>
											</Box>
											<Box sx={{ textAlign: 'right' }}>
												<Typography
													variant="body2"
													color="textSecondary"
													sx={{ mb: 0.5 }}>
													Qty: {item.quantity}
												</Typography>
												<Typography
													variant="body1"
													fontWeight={600}>
													Rs.{' '}
													{(
														item.price_per *
														item.quantity
													).toLocaleString()}
												</Typography>
											</Box>
										</Box>
									))}
								</Box>
							</CardContent>
						</StyledCard>
					</motion.div>
				))
			)}
		</Container>
	)
}

export default PurchaseHistoryView
