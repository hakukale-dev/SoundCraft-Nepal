import { useState, useEffect } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Chip,
	useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

const OrderInfoPopup = ({ order, open, onClose }) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	if (!order) return null

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			fullScreen={isMobile}>
			<DialogTitle>Order #{order._id}</DialogTitle>
			<DialogContent dividers>
				<Grid
					container
					spacing={isMobile ? 1 : 3}>
					<Grid
						item
						xs={12}
						md={6}>
						<Typography
							variant={isMobile ? 'subtitle1' : 'h6'}
							gutterBottom>
							Customer Information
						</Typography>
						<Typography variant={isMobile ? 'body2' : 'body1'}>
							{order.user_id
								? `${order.user_id.first_name} ${order.user_id.last_name}`
								: 'Guest User'}
						</Typography>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}>
						<Typography
							variant={isMobile ? 'subtitle1' : 'h6'}
							gutterBottom>
							Order Details
						</Typography>
						<Typography variant={isMobile ? 'body2' : 'body1'}>
							Date: {new Date(order.createdAt).toLocaleString()}
						</Typography>
						<Typography variant={isMobile ? 'body2' : 'body1'}>
							Payment Method: {order.payment_method}
						</Typography>
						<Typography variant={isMobile ? 'body2' : 'body1'}>
							Status:{' '}
							<Chip
								label={order.status}
								size={isMobile ? 'small' : 'medium'}
								color={
									order.status === 'completed'
										? 'success'
										: order.status === 'pending'
										? 'warning'
										: 'error'
								}
							/>
						</Typography>
						<Typography variant={isMobile ? 'body2' : 'body1'}>
							Total: ${order.amount}
						</Typography>
					</Grid>

					<Grid
						item
						xs={12}>
						<Typography
							variant={isMobile ? 'subtitle1' : 'h6'}
							gutterBottom>
							Order Items
						</Typography>
						<Table size={isMobile ? 'small' : 'medium'}>
							<TableBody>
								{order.items?.map((item) => (
									<TableRow key={item._id}>
										<TableCell sx={{ p: isMobile ? 1 : 2 }}>
											<Typography
												variant={
													isMobile ? 'body2' : 'body1'
												}>
												{item.product_id?.name ||
													'Product not available'}
											</Typography>
										</TableCell>
										<TableCell sx={{ p: isMobile ? 1 : 2 }}>
											<Typography
												variant={
													isMobile ? 'body2' : 'body1'
												}>
												{item.quantity} x $
												{item.price_per}
											</Typography>
										</TableCell>
										<TableCell sx={{ p: isMobile ? 1 : 2 }}>
											<Typography
												variant={
													isMobile ? 'body2' : 'body1'
												}>
												$
												{item.quantity * item.price_per}
											</Typography>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={onClose}
					size={isMobile ? 'small' : 'medium'}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default OrderInfoPopup
