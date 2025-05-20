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
	useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

const ProductInfoPopup = ({ product, open, onClose, onEdit, onDelete }) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	if (!product) return null

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			fullScreen={isMobile}>
			<DialogTitle>{product.name}</DialogTitle>
			<DialogContent dividers>
				<Grid
					container
					spacing={isMobile ? 1 : 3}
					direction={isMobile ? 'column' : 'row'}>
					<Grid
						item
						xs={12}
						md={4}>
						<Avatar
							src={product.image}
							variant="rounded"
							sx={{
								width: '100%',
								height: isMobile ? 200 : 300,
								bgcolor: theme.palette.grey[200],
							}}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						md={8}>
						<Typography
							variant={isMobile ? 'subtitle1' : 'h6'}
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
							spacing={1}
							sx={{ mt: 1 }}>
							<Grid
								item
								xs={6}>
								<Typography
									variant={isMobile ? 'body2' : 'subtitle1'}>
									Price: ${product.price}
								</Typography>
							</Grid>
							<Grid
								item
								xs={6}>
								<Typography
									variant={isMobile ? 'body2' : 'subtitle1'}>
									Stock: {product.stock}
								</Typography>
							</Grid>
							<Grid
								item
								xs={6}>
								<Typography
									variant={isMobile ? 'body2' : 'subtitle1'}>
									Category: {product.category}
								</Typography>
							</Grid>
							<Grid
								item
								xs={6}>
								<Typography
									variant={isMobile ? 'body2' : 'subtitle1'}>
									SKU: {product.sku}
								</Typography>
							</Grid>
						</Grid>
						<Grid
							container
							spacing={1}
							sx={{ mt: 1 }}>
							<Grid
								item
								xs={12}>
								<Rating
									value={product.averageRating || 0}
									readOnly
									precision={0.1}
									size={isMobile ? 'small' : 'medium'}
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
									size={isMobile ? 'small' : 'medium'}
									sx={{ mr: 1 }}
								/>
								{product.hasDiscount && (
									<Chip
										label="On Sale"
										color="warning"
										size={isMobile ? 'small' : 'medium'}
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
					color="error"
					size={isMobile ? 'small' : 'medium'}>
					Delete
				</Button>
				<Button
					onClick={onEdit}
					color="primary"
					size={isMobile ? 'small' : 'medium'}>
					Edit
				</Button>
				<Button
					onClick={onClose}
					size={isMobile ? 'small' : 'medium'}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ProductInfoPopup
