import React, { useCallback } from 'react'
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
	IconButton,
	useMediaQuery,
} from '@mui/material'
import { motion } from 'framer-motion'
import {
	KeyboardArrowRight,
	Star,
	ShoppingCartSharp,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { addToCart } from 'src/store/cartSlice'
import { selectCanAddToCart } from '../store/cartSlice'
import { toast } from 'react-toastify'

const MotionCard = motion(Card)
const MotionButton = motion(Button)

const ProductScrollSection = ({ title, icon, items }) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { isAuthenticated, user } = useSelector((state) => state.auth)
	const store = useStore()

	const handleAddToCart = useCallback(
		(product) => {
			if (!isAuthenticated) {
				navigate('/login')
				return
			}

			if (!product?._id || !product?.price) {
				toast.error('Invalid product information')
				return
			}

			const currentState = store.getState()
			const canAdd = selectCanAddToCart(
				currentState,
				user._id,
				product._id,
				1
			)

			if (!canAdd) {
				toast.error('Cannot add more than available stock')
				return
			}

			dispatch(
				addToCart({
					userId: user._id,
					product: {
						_id: product._id,
						name: product.name,
						price: product.price,
						image: product.image,
						stock: product.stock,
					},
				})
			)

			toast.success(`${product.name} added to cart!`)
		},
		[dispatch, user, isAuthenticated, navigate, store]
	)

	return (
		<Box sx={{ mb: isMobile ? 6 : 10, position: 'relative' }}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					mb: isMobile ? 3 : 6,
					px: 2,
				}}>
				{React.cloneElement(icon, {
					sx: {
						fontSize: isMobile ? '1.8rem' : '2.5rem',
						color: 'primary.main',
						filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
					},
				})}
				<Typography
					variant={isMobile ? 'h4' : 'h3'}
					sx={{
						fontWeight: 800,
						ml: 2,
						fontSize: isMobile
							? '1.4rem'
							: { xs: '1.8rem', md: '2.4rem' },
						textShadow: '0 2px 4px rgba(0,0,0,0.1)',
					}}>
					{title}
				</Typography>
			</Box>

			<Grid
				container
				spacing={isMobile ? 2 : 3}
				sx={{
					display: 'flex',
					flexWrap: 'nowrap',
					overflowX: 'auto',
					py: isMobile ? 2 : 4,
					px: 2,
					'&::-webkit-scrollbar': {
						height: '4px',
						backgroundColor: 'transparent',
					},
					'&::-webkit-scrollbar-thumb': {
						borderRadius: '4px',
						backgroundColor: theme.palette.action.hover,
						'&:hover': {
							backgroundColor: theme.palette.action.selected,
						},
					},
				}}>
				{items.map((product) => (
					<Grid
						item
						key={product._id}
						sx={{
							minWidth: isMobile
								? '85vw'
								: { xs: '75vw', sm: '380px', md: '400px' },
							pr: isMobile ? 2 : 3,
						}}>
						<MotionCard
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							whileHover={{ scale: isMobile ? 1 : 1.02 }}
							sx={{
								height: '100%',
								borderRadius: 2,
								overflow: 'hidden',
								boxShadow: theme.shadows[1],
								transition:
									'all 0.3s cubic-bezier(.25,.8,.25,1)',
								'&:hover': {
									boxShadow: isMobile
										? theme.shadows[1]
										: theme.shadows[6],
								},
							}}>
							<Box
								sx={{
									position: 'relative',
									overflow: 'hidden',
								}}>
								<CardMedia
									component="img"
									image={product.image}
									alt={product.name}
									sx={{
										height: isMobile ? 180 : 280,
										objectFit: 'cover',
										transition: 'transform 0.3s ease',
										'&:hover': {
											transform: isMobile
												? 'none'
												: 'scale(1.05)',
										},
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
											'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4))',
									}}
								/>
								<Box
									sx={{
										position: 'absolute',
										top: 8,
										left: 8,
										display: 'flex',
										gap: 1,
										flexWrap: 'wrap',
									}}>
									{product.isNew && (
										<Chip
											label="New"
											color="primary"
											size="small"
											sx={{
												fontWeight: 700,
												borderRadius: 1,
												px: 1,
												height: 24,
												'& .MuiChip-label': { px: 0.5 },
											}}
										/>
									)}
									{product.discount > 0 && (
										<Chip
											label={`-${product.discount}%`}
											color="error"
											size="small"
											sx={{
												fontWeight: 700,
												borderRadius: 1,
												px: 1,
												height: 24,
												'& .MuiChip-label': { px: 0.5 },
											}}
										/>
									)}
								</Box>
							</Box>
							<CardContent sx={{ p: isMobile ? 1.5 : 2.5 }}>
								<Stack spacing={1}>
									<Typography
										variant={isMobile ? 'subtitle1' : 'h6'}
										sx={{
											fontWeight: 800,
											color: 'text.primary',
											lineHeight: 1.3,
											minHeight: isMobile
												? '2.8em'
												: '3.2em',
											display: '-webkit-box',
											WebkitLineClamp: 2,
											WebkitBoxOrient: 'vertical',
											overflow: 'hidden',
											fontSize: isMobile
												? '0.9rem'
												: '1rem',
										}}>
										{product.name}
									</Typography>
									<Typography
										variant="body2"
										sx={{
											color: 'text.secondary',
											fontWeight: 500,
											textTransform: 'uppercase',
											letterSpacing: 0.5,
											fontSize: isMobile
												? '0.7rem'
												: '0.8rem',
										}}>
										{product.category}
									</Typography>

									<Stack
										direction="row"
										spacing={1}
										alignItems="center">
										<Rating
											value={product.rating}
											readOnly
											precision={0.5}
											size={isMobile ? 'small' : 'medium'}
											emptyIcon={
												<Star
													sx={{
														color: 'text.disabled',
														opacity: 0.4,
													}}
												/>
											}
											sx={{
												color: 'warning.main',
												'& .MuiRating-iconFilled': {
													textShadow:
														'0 2px 4px rgba(0,0,0,0.1)',
												},
											}}
										/>
										<Typography
											variant="body2"
											sx={{
												fontWeight: 600,
												color: 'text.secondary',
												fontSize: isMobile
													? '0.7rem'
													: '0.8rem',
											}}>
											({product.reviews})
										</Typography>
									</Stack>

									<Stack
										direction="row"
										justifyContent="space-between"
										alignItems="center"
										sx={{ mt: 1 }}>
										<Stack spacing={0.25}>
											<Typography
												variant={isMobile ? 'h6' : 'h5'}
												sx={{
													fontWeight: 800,
													color: 'primary.main',
													lineHeight: 1,
													fontSize: isMobile
														? '1rem'
														: '1.5rem',
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
														fontSize: isMobile
															? '0.7rem'
															: '0.8rem',
													}}>
													Rs. {product.originalPrice}
												</Typography>
											)}
										</Stack>
										<Stack
											direction={{
												xs: 'row',
												sm: 'row',
											}}
											spacing={1}
											sx={{
												width: {
													xs: 'auto',
													sm: 'auto',
												},
											}}>
											<MotionButton
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												variant="outlined"
												color="primary"
												size={
													isMobile
														? 'small'
														: 'medium'
												}
												onClick={() =>
													navigate(
														`/products/${product._id}`
													)
												}
												endIcon={
													isMobile ? null : (
														<motion.div
															animate={{
																x: [0, 4, 0],
															}}
															transition={{
																repeat: Infinity,
																duration: 1.5,
															}}>
															<KeyboardArrowRight />
														</motion.div>
													)
												}
												sx={{
													fontWeight: 700,
													borderRadius: 2,
													textTransform: 'none',
													fontSize: isMobile
														? '0.75rem'
														: '0.875rem',
													whiteSpace: 'nowrap',
													minWidth: isMobile
														? 'auto'
														: '100px',
													p: isMobile
														? '6px 8px'
														: '8px 16px',
												}}>
												{isMobile ? 'View' : 'Details'}
											</MotionButton>

											<IconButton
												color="primary"
												size={
													isMobile
														? 'small'
														: 'medium'
												}
												onClick={() =>
													handleAddToCart(product)
												}>
												<ShoppingCartSharp
													fontSize={
														isMobile
															? 'small'
															: 'medium'
													}
												/>
											</IconButton>
										</Stack>
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
