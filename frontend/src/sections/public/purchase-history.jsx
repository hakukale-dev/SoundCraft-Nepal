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
				console.log(data)
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

	const handleDownloadReceipt = async (purchaseId) => {
		try {
			const purchase = billingHistory.find(
				(item) => item._id === purchaseId
			)
			if (!purchase) {
				throw new Error('Purchase not found in history')
			}

			// Create PDF receipt using jsPDF
			const { jsPDF } = await import('jspdf')
			const doc = new jsPDF()

			// Add company logo and header
			doc.setFontSize(20)
			doc.setTextColor(40, 40, 40)
			doc.setFont('helvetica', 'bold')
			doc.text('SoundCraft', 105, 20, { align: 'center' })

			doc.setFontSize(12)
			doc.setTextColor(100, 100, 100)
			doc.text('123 Shop Street, Kathmandu, Nepal', 105, 28, {
				align: 'center',
			})
			doc.text(
				'Phone: +977 1234567890 | Email: info@gshop.com',
				105,
				35,
				{ align: 'center' }
			)

			// Add invoice title and details
			doc.setDrawColor(200, 200, 200)
			doc.line(15, 45, 195, 45)

			doc.setFontSize(18)
			doc.setTextColor(40, 40, 40)
			doc.text(`INVOICE #${purchaseId}`, 15, 55)

			doc.setFontSize(12)
			doc.text(
				`Date: ${new Date(purchase.createdAt).toLocaleString()}`,
				15,
				65
			)
			doc.text(`Customer: ${user?.first_name} ${user?.last_name}`, 15, 75)

			// Add table headers
			const headers = ['Item', 'Qty', 'Unit Price', 'Total']
			const data = purchase.items.map((item) => [
				item.product_id.name,
				item.quantity,
				`$${item.price_per.toFixed(2)}`,
				`$${(item.quantity * item.price_per).toFixed(2)}`,
			])

			// Add total row
			data.push(['', '', 'Subtotal:', `$${purchase.amount.toFixed(2)}`])
			data.push([
				'',
				'',
				'Tax (13%):',
				`$${(purchase.amount * 0.13).toFixed(2)}`,
			])
			data.push([
				'',
				'',
				'Grand Total:',
				`$${(purchase.amount * 1.13).toFixed(2)}`,
			])

			// Create table
			let yPos = 90
			const colWidths = [90, 20, 30, 30]
			const rowHeight = 10

			// Draw headers with background
			doc.setFillColor(240, 240, 240)
			doc.rect(15, yPos - 5, 170, rowHeight, 'F')
			doc.setFont('helvetica', 'bold')
			headers.forEach((header, i) => {
				doc.text(
					header,
					15 +
						colWidths.slice(0, i).reduce((a, b) => a + b, 0) +
						(i > 0 ? 5 : 0),
					yPos
				)
			})
			yPos += rowHeight + 5

			// Draw data rows
			doc.setFont('helvetica', 'normal')
			data.forEach((row, rowIndex) => {
				row.forEach((cell, colIndex) => {
					const xPos =
						15 +
						colWidths
							.slice(0, colIndex)
							.reduce((a, b) => a + b, 0) +
						(colIndex > 0 ? 5 : 0)

					// Style total rows
					if (rowIndex >= data.length - 3) {
						doc.setFont('helvetica', 'bold')
						if (rowIndex === data.length - 1) {
							doc.setTextColor(0, 100, 0)
						}
					}

					doc.text(cell.toString(), xPos, yPos)
					doc.setFont('helvetica', 'normal')
					doc.setTextColor(0, 0, 0)
				})
				yPos += rowHeight
			})

			// Add footer
			doc.setFontSize(10)
			doc.setTextColor(100, 100, 100)
			doc.text('Thank you for shopping with us!', 105, yPos + 20, {
				align: 'center',
			})
			doc.text(
				'Terms & Conditions: All sales are final. No returns or exchanges.',
				105,
				yPos + 30,
				{ align: 'center' }
			)

			// Save the PDF
			doc.save(`GShop_Invoice_${purchaseId}.pdf`)
		} catch (error) {
			console.error('Error downloading receipt:', error)
			alert(
				error.message || 'Failed to download receipt. Please try again.'
			)
		}
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
