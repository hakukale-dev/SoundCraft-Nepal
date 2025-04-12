import React from 'react'
import {
	Box,
	Typography,
	Grid,
	CardMedia,
	CardContent,
	Stack,
	Rating,
	Chip,
	Card,
	Button,
	useTheme,
} from '@mui/material'
import { motion } from 'framer-motion'
import { KeyboardArrowRight, Star } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const MotionCard = motion(Card)
const MotionButton = motion(Button)

const ProductScrollSection = ({ title, icon, items }) => {
	const theme = useTheme()
	const navigate = useNavigate()

	return (
		<Box sx={{ mb: 10, position: 'relative' }}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					mb: 6,
					px: 2,
				}}>
				{React.cloneElement(icon, {
					sx: { fontSize: '2.5rem', color: 'primary.main' },
				})}
				<Typography
					variant="h3"
					sx={{
						fontWeight: 800,
						ml: 2,
						fontSize: { xs: '1.8rem', md: '2.4rem' },
					}}>
					{title}
				</Typography>
			</Box>

			<Grid
				container
				spacing={3}
				sx={{
					display: 'flex',
					flexWrap: 'nowrap',
					overflowX: 'auto',
					py: 4,
					px: 2,
					'&::-webkit-scrollbar': {
						height: '8px',
						backgroundColor: 'transparent',
					},
					'&::-webkit-scrollbar-thumb': {
						borderRadius: '4px',
						backgroundColor: theme.palette.action.hover,
					},
					'&:hover::-webkit-scrollbar-thumb': {
						backgroundColor: theme.palette.action.selected,
					},
				}}>
				{items.map((product) => (
					<Grid
						item
						key={product._id}
						sx={{
							minWidth: { xs: '85vw', sm: '400px', md: '420px' },
							pr: 3,
						}}>
						<MotionCard
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							whileHover={{ scale: 1.02 }}
							sx={{
								height: '100%',
								borderRadius: 4,
								overflow: 'hidden',
								boxShadow: theme.shadows[4],
								transition:
									'all 0.3s cubic-bezier(.25,.8,.25,1)',
								'&:hover': {
									boxShadow: theme.shadows[8],
								},
							}}>
							<Box sx={{ position: 'relative' }}>
								<CardMedia
									component="img"
									image={product.image}
									alt={`${product.name} product image`}
									sx={{
										height: 320,
										objectFit: 'cover',
										transition: 'transform 0.3s',
									}}
								/>
								<Box
									sx={{
										position: 'absolute',
										top: 0,
										left: 0,
										right: 0,
										bottom: 0,
										background:
											'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.3))',
									}}
								/>
								<Box
									sx={{
										position: 'absolute',
										top: 16,
										left: 16,
										display: 'flex',
										gap: 1,
										flexWrap: 'wrap',
									}}>
									{product.isNew && (
										<Chip
											label="New Arrival"
											color="primary"
											size="small"
											sx={{
												fontWeight: 700,
												borderRadius: 2,
												px: 1,
												textShadow:
													'0 1px 2px rgba(0,0,0,0.1)',
											}}
										/>
									)}
									{product.discount > 0 && (
										<Chip
											label={`${product.discount}% OFF`}
											color="error"
											size="small"
											sx={{
												fontWeight: 700,
												borderRadius: 2,
												px: 1,
											}}
										/>
									)}
								</Box>
							</Box>
							<CardContent sx={{ p: 3 }}>
								<Stack spacing={2}>
									<Typography
										variant="h6"
										sx={{
											fontWeight: 700,
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											display: '-webkit-box',
											WebkitLineClamp: 2,
											WebkitBoxOrient: 'vertical',
										}}>
										{product.name}
									</Typography>
									<Typography
										variant="p"
										sx={{
											fontWeight: 300,
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											display: '-webkit-box',
											WebkitLineClamp: 2,
											WebkitBoxOrient: 'vertical',
										}}>
										{product.category} | {product.model}
									</Typography>

									<Stack
										direction="row"
										spacing={2}
										alignItems="center">
										<Rating
											value={product.rating}
											readOnly
											precision={0.5}
											size="medium"
											emptyIcon={
												<Star
													sx={{
														color: 'text.disabled',
														opacity: 0.5,
													}}
												/>
											}
											sx={{
												color: 'warning.main',
											}}
										/>
										<Typography
											variant="body1"
											sx={{ fontWeight: 500 }}>
											{product.rating}
											<Typography
												component="span"
												variant="body2"
												color="text.secondary"
												sx={{ ml: 0.5 }}>
												({product.reviews} reviews)
											</Typography>
										</Typography>
									</Stack>

									<Stack
										direction="row"
										justifyContent="space-between"
										alignItems="flex-end">
										<Stack spacing={0.5}>
											<Typography
												variant="h5"
												sx={{
													fontWeight: 800,
													color: 'primary.main',
												}}>
												Rs. {product.price}
											</Typography>
											{product.originalPrice && (
												<Typography
													variant="body2"
													sx={{
														color: 'text.disabled',
														textDecoration:
															'line-through',
													}}>
													Rs. {product.originalPrice}
												</Typography>
											)}
										</Stack>
										<MotionButton
											whileHover={{
												scale: 1.05,
												backgroundColor:
													theme.palette.primary.dark,
											}}
											whileTap={{ scale: 0.95 }}
											variant="contained"
											color="primary"
											size="medium"
											onClick={() =>
												navigate(
													`/products/${product._id}`
												)
											}
											endIcon={
												<motion.div
													animate={{ x: 0 }}
													transition={{
														repeatType: 'mirror',
														repeat: Infinity,
														duration: 1.5,
													}}>
													<KeyboardArrowRight />
												</motion.div>
											}
											sx={{
												px: 4,
												py: 1,
												fontWeight: 700,
												borderRadius: 3,
												textTransform: 'none',
												fontSize: '1rem',
											}}>
											View Details
										</MotionButton>
									</Stack>
								</Stack>
							</CardContent>
						</MotionCard>
					</Grid>
				))}
			</Grid>
		</Box>
	)
}

export default ProductScrollSection
