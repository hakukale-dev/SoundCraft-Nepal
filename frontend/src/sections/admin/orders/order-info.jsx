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
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

const OrderInfoPopup = ({ order, open, onClose }) => {
	const theme = useTheme()

	if (!order) return null

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth>
			<DialogTitle>Order #{order._id}</DialogTitle>
			<DialogContent dividers>
				<Grid
					container
					spacing={3}>
					<Grid
						item
						xs={12}
						md={6}>
						<Typography
							variant="h6"
							gutterBottom>
							Customer Information
						</Typography>
						<Typography variant="body1">
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
							variant="h6"
							gutterBottom>
							Order Details
						</Typography>
						<Typography variant="body1">
							Date: {new Date(order.createdAt).toLocaleString()}
						</Typography>
						<Typography variant="body1">
							Payment Method: {order.payment_method}
						</Typography>
						<Typography variant="body1">
							Status:{' '}
							<Chip
								label={order.status}
								color={
									order.status === 'completed'
										? 'success'
										: order.status === 'pending'
										? 'warning'
										: 'error'
								}
							/>
						</Typography>
						<Typography variant="body1">
							Total: ${order.amount}
						</Typography>
					</Grid>

					<Grid
						item
						xs={12}>
						<Typography
							variant="h6"
							gutterBottom>
							Order Items
						</Typography>
						<Table>
							<TableBody>
								{order.items?.map((item) => (
									<TableRow key={item._id}>
										<TableCell>
											{item.product_id?.name ||
												'Product not available'}
										</TableCell>
										<TableCell>
											{item.quantity} x ${item.price_per}
										</TableCell>
										<TableCell>
											${item.quantity * item.price_per}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	)
}

export default OrderInfoPopup
