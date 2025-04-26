import { useState, useEffect } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Grid,
	Avatar,
	Rating,
	Chip,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

const ProductInfoPopup = ({ product, open, onClose, onEdit, onDelete }) => {
	const theme = useTheme()

	if (!product) return null

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth>
			<DialogTitle>{product.name}</DialogTitle>
			<DialogContent dividers>
				<Grid
					container
					spacing={3}>
					<Grid
						item
						xs={12}
						md={4}>
						<Avatar
							src={product.image}
							variant="rounded"
							sx={{
								width: '100%',
								height: 300,
								bgcolor: theme.palette.grey[200],
							}}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						md={8}>
						<Typography
							variant="h6"
							gutterBottom>
							{product.model}
						</Typography>
						<Typography
							variant="body1"
							gutterBottom>
							{product.description}
						</Typography>
						<Grid
							container
							spacing={2}
							sx={{ mt: 2 }}>
							<Grid
								item
								xs={6}>
								<Typography variant="subtitle1">
									Price: ${product.price}
								</Typography>
							</Grid>
							<Grid
								item
								xs={6}>
								<Typography variant="subtitle1">
									Stock: {product.stock}
								</Typography>
							</Grid>
							<Grid
								item
								xs={6}>
								<Typography variant="subtitle1">
									Category: {product.category}
								</Typography>
							</Grid>
							<Grid
								item
								xs={6}>
								<Typography variant="subtitle1">
									SKU: {product.sku}
								</Typography>
							</Grid>
						</Grid>
						<Grid
							container
							spacing={2}
							sx={{ mt: 2 }}>
							<Grid
								item
								xs={12}>
								<Rating
									value={product.averageRating || 0}
									readOnly
									precision={0.1}
								/>
								<Typography variant="caption">
									({product.totalReviews || 0} reviews)
								</Typography>
							</Grid>
							<Grid
								item
								xs={12}>
								<Chip
									label={
										product.stock > 0
											? 'In Stock'
											: 'Out of Stock'
									}
									color={
										product.isInStock ? 'success' : 'error'
									}
									sx={{ mr: 1 }}
								/>
								{product.hasDiscount && (
									<Chip
										label="On Sale"
										color="warning"
									/>
								)}
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={onDelete}
					color="error">
					Delete
				</Button>
				<Button
					onClick={onEdit}
					color="primary">
					Edit
				</Button>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ProductInfoPopup
