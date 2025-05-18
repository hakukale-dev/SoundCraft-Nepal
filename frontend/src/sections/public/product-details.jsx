import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
	Box,
	Container,
	Grid,
	Typography,
	Button,
	Stack,
	Chip,
	Rating,
	Breadcrumbs,
	Link,
	IconButton,
	Skeleton,
	Tabs,
	Tab,
	useMediaQuery,
	useTheme,
	TextField,
	Avatar,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Iconify from '../../components/iconify'
import { ProductDetailsCarousel } from '../../components/carousel'
import axios from 'src/utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import {
	addToCart,
	selectCanAddToCart,
	selectCartDetails,
} from '../../store/cartSlice'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const StyledRoot = styled('div')(({ theme }) => ({
	padding: theme.spacing(6, 0),
	backgroundColor: theme.palette.background.default,
}))

const ProductInfoCard = styled('div')(({ theme }) => ({
	padding: theme.spacing(4),
	borderRadius: theme.shape.borderRadius * 2,
	backgroundColor: theme.palette.background.paper,
	boxShadow: theme.shadows[10],
}))

const PriceBox = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(2),
	padding: theme.spacing(3),
	borderRadius: theme.shape.borderRadius,
	border: `1px solid ${theme.palette.divider}`,
}))

const ReviewSection = ({ productId, reviews, handleSubmit }) => {
	const { isAuthenticated, user } = useSelector((state) => state.auth)
	const [rating, setRating] = useState(0)
	const [comment, setComment] = useState('')

	const handleRatingChange = (event, newValue) => {
		setRating(newValue)
	}

	const handleCommentChange = (event) => {
		setComment(event.target.value)
	}

	const handleSubmitReview = () => {
		if (rating > 0 && comment.trim()) {
			handleSubmit({ productId, rating, comment })
			setRating(0)
			setComment('')
		}
	}

	return (
		<Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 2 }}>
			<Stack spacing={4}>
				{isAuthenticated && (
					<Box>
						<Typography
							variant="h6"
							gutterBottom>
							Write a Review
						</Typography>
						<TextField
							fullWidth
							multiline
							rows={4}
							value={comment}
							onChange={handleCommentChange}
							placeholder="Share your experience with this product..."
							variant="outlined"
							sx={{ mb: 2 }}
						/>
						<Stack
							direction="row"
							alignItems="center"
							justifyContent="space-between">
							<Rating
								name="product-rating"
								value={rating}
								onChange={handleRatingChange}
								precision={0.5}
								size="large"
								sx={{ mb: 2 }}
							/>
							<Button
								onClick={handleSubmitReview}
								variant="contained"
								color="primary"
								disabled={!rating || !comment.trim()}>
								Submit Review
							</Button>
						</Stack>
					</Box>
				)}

				{reviews?.length > 0 ? (
					<Stack spacing={3}>
						<Typography variant="h6">
							Customer Reviews ({reviews.length})
						</Typography>
						{reviews.map((review) => (
							<Box
								key={review._id}
								sx={{
									p: 2,
									border: '1px solid',
									borderColor: 'divider',
									borderRadius: 1,
								}}>
								<Stack
									direction="row"
									spacing={2}
									alignItems="center"
									sx={{ mb: 1 }}>
									<Avatar src={review.user?.photo} />
									<Typography variant="subtitle1">
										{review.user?.first_name}{' '}
										{review.user?.last_name}
									</Typography>
									<Rating
										value={review.rating}
										precision={0.5}
										readOnly
									/>
									<Typography
										variant="caption"
										color="text.secondary">
										{new Date(
											review.createdAt
										).toLocaleDateString()}
									</Typography>
								</Stack>
								<Typography variant="body1">
									{review.comment}
								</Typography>
							</Box>
						))}
					</Stack>
				) : (
					<Typography
						variant="body1"
						color="text.secondary">
						No reviews yet. Be the first to review!
					</Typography>
				)}
			</Stack>
		</Box>
	)
}

export default function ProductDetailsPage() {
	const dispatch = useDispatch()
	const theme = useTheme()
	const navigate = useNavigate()
	const { id } = useParams()
	const [rawProductData, setRawProductData] = useState(null)
	const [product, setProduct] = useState(null)
	const [reviews, setReviews] = useState(null)
	const [isInWishlist, setIsInWishlist] = useState(false)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [currentTab, setCurrentTab] = useState('description')
	const { isAuthenticated, user } = useSelector((state) => state.auth)
	const { items } = useSelector((state) =>
		selectCartDetails(state, user?._id)
	)
	const canAdd = useSelector((state) =>
		selectCanAddToCart(state, user?._id, rawProductData?._id, 1)
	)

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const response = await axios.get(`/api/products/${id}`)
				const data = response.data

				const transformedProduct = {
					...data,
					images: [data.image, ...(data.additionalImages || [])],
					details: data.description
						? data.description.split('. ').filter(Boolean)
						: [],
					categoryLabel:
						data.category?.replace(' Instruments', '') || '',
					specifications: data.specifications || [],
					faqs: data.faqs || [],
					isInStock: (data.stock || 0) > 0,
					hasDiscount: (data.price || 0) < 100,
				}

				setRawProductData(data)
				setProduct(transformedProduct)
			} catch (err) {
				console.error('Error fetching product:', err)
				setError(
					err.response?.data?.message ||
						'Failed to fetch product details'
				)
			} finally {
				setLoading(false)
			}
		}

		const fetchReviews = async () => {
			try {
				const response = await axios.get(`/api/reviews/product/${id}`)
				setReviews(response.data.data)
			} catch (err) {
				console.error('Error fetching reviews:', err)
				setError(
					err.response?.data?.message ||
						'Failed to fetch product reviews'
				)
			}
		}

		const fetchWishlist = async () => {
			try {
				const response = await axios.get('/api/wishlist')
				setIsInWishlist(
					response.data.products.some((p) => p._id === id)
				)
			} catch (err) {
				console.error('Error fetching wishlist:', err)
			}
		}

		// Only fetch if id exists
		if (id) {
			fetchProduct()
			fetchReviews()
			fetchWishlist()
		} else {
			setError('Invalid product ID')
			setLoading(false)
		}
	}, [id])

	const handleTabChange = (event, newValue) => {
		setCurrentTab(newValue)
	}

	const handleAddToCart = () => {
		if (!isAuthenticated) {
			navigate('/login')
			return
		}

		if (!product || !product._id || !product.price) {
			toast.error('Invalid product information', {
				position: 'bottom-right',
			})
			return
		}

		if (!canAdd) {
			toast.error('This item is out of stock', {
				position: 'bottom-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: 'light',
			})
			return
		}

		try {
			dispatch(
				addToCart({
					userId: user?._id,
					product: {
						_id: rawProductData._id,
						name: rawProductData.name,
						price: rawProductData.price,
						image: rawProductData.image,
						stock: rawProductData.stock,
					},
				})
			)

			// Optional: Check current quantity for more specific feedback
			const currentItem = items?.find((item) => item._id === product._id)
			const verb = currentItem?.qty ? 'updated in' : 'added to'

			toast.success(`Product ${verb} cart!`, {
				position: 'bottom-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: 'light',
			})
		} catch (error) {
			toast.error('Failed to update cart', {
				position: 'bottom-right',
				autoClose: 3000,
				theme: 'colored',
			})
		}
	}

	const handleReviewSubmission = async (data) => {
		try {
			const response = await axios.post('/api/reviews', data)

			if (response.data.success) {
				toast.success('Review submitted successfully!', {
					position: 'bottom-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: 'light',
				})

				// Update product state to include new review
				setProduct((prev) => ({
					...prev,
					reviews: [
						{
							user: user,
							rating: data.rating,
							comment: data.comment,
							createdAt: new Date(),
						},
						...prev.reviews,
					],
				}))
			}
		} catch (error) {
			console.error('Error submitting review:', error)
			toast.error(
				error.response?.data?.message || 'Failed to submit review',
				{
					position: 'bottom-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: 'light',
				}
			)
		}
	}

	const handleAddToWishlist = async () => {
		try {
			if (!isAuthenticated) {
				navigate('/login')
				return
			}

			const response = await axios.post(`/api/wishlist/${product._id}`)

			if (response.data.success) {
				toast.success('Added to wishlist!', {
					position: 'bottom-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: 'light',
				})
				setIsInWishlist(true)
			}
		} catch (error) {
			console.error('Error adding to wishlist:', error)
			toast.error(
				error.response?.data?.message || 'Failed to add to wishlist',
				{
					position: 'bottom-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: 'light',
				}
			)
		}
	}

	if (error)
		return (
			<Box sx={{ textAlign: 'center', py: 10 }}>
				<Iconify
					icon="ic:round-error-outline"
					width={60}
					color="error.main"
				/>
				<Typography
					variant="h4"
					color="error"
					sx={{ mt: 2 }}>
					Failed to load product
				</Typography>
				<Typography
					variant="body1"
					sx={{ mt: 1, color: 'text.secondary' }}>
					{error}
				</Typography>
			</Box>
		)

	if (!product && !loading) return null

	return (
		!loading && (
			<StyledRoot>
				<Container>
					<ToastContainer />
					<Box sx={{ mb: 4 }}>
						<Breadcrumbs
							aria-label="breadcrumb"
							sx={{ mb: 4 }}>
							<Link
								color="inherit"
								onClick={() => navigate('/')}
								style={{ cursor: 'pointer' }}>
								Home
							</Link>
							<Link
								color="inherit"
								onClick={() => navigate('/products')}
								style={{ cursor: 'pointer' }}>
								Products
							</Link>
							<Typography color="text.primary">
								{loading ? (
									<Skeleton width={120} />
								) : (
									product.name
								)}
							</Typography>
						</Breadcrumbs>

						<Grid
							container
							spacing={4}>
							<Grid
								item
								xs={12}
								md={6}>
								{loading ? (
									<Skeleton
										variant="rectangular"
										height={500}
									/>
								) : (
									<ProductDetailsCarousel
										images={product.images}
									/>
								)}
							</Grid>

							<Grid
								item
								xs={12}
								md={6}>
								<ProductInfoCard>
									{loading ? (
										<>
											<Skeleton height={60} />
											<Skeleton width="40%" />
										</>
									) : (
										<>
											<Chip
												label={product.categoryLabel}
												color="primary"
												variant="outlined"
												sx={{ mb: 2 }}
											/>
											<Typography
												variant="h2"
												gutterBottom
												sx={{
													fontWeight: 700,
												}}>
												{product.name}
											</Typography>
										</>
									)}

									{loading ? (
										<Skeleton width="30%" />
									) : (
										<Stack
											direction="row"
											spacing={1}
											alignItems="center"
											sx={{ mb: 2 }}>
											<Rating
												value={product.averageRating}
												precision={0.5}
												readOnly
												size="large"
											/>
											<Typography
												variant="body2"
												color="text.secondary">
												({product.totalReviews} reviews)
											</Typography>
										</Stack>
									)}

									{loading ? (
										<Skeleton width="40%" />
									) : (
										<PriceBox>
											<Typography
												variant="h3"
												color="primary.main">
												Rs. {product.price}
											</Typography>
											{product.hasDiscount && (
												<Typography
													variant="h6"
													color="text.disabled"
													sx={{
														textDecoration:
															'line-through',
													}}>
													Rs. {product.originalPrice}
												</Typography>
											)}
											{product.isInStock ? (
												<Chip
													label="In Stock"
													color="success"
													variant="filled"
													sx={{ ml: 'auto' }}
												/>
											) : (
												<Chip
													label="Out of Stock"
													color="error"
													variant="filled"
													sx={{ ml: 'auto' }}
												/>
											)}
										</PriceBox>
									)}

									<Tabs
										value={currentTab}
										onChange={handleTabChange}
										sx={{ mb: 3 }}
										variant="scrollable">
										<Tab
											label="Description"
											value="description"
										/>
										<Tab
											label="Specifications"
											value="specifications"
										/>
										<Tab
											label="Reviews"
											value="reviews"
										/>
										<Tab
											label="FAQ"
											value="faq"
										/>
									</Tabs>

									{currentTab === 'description' && (
										<Box
											sx={{
												maxHeight: 400,
												overflowY: 'auto',
												pr: 2,
											}}>
											<Stack spacing={2}>
												{product.details?.map(
													(detail, index) => (
														<Stack
															key={index}
															direction="row"
															spacing={2}>
															<Iconify
																icon="mdi:check-circle-outline"
																width={24}
																color="primary.main"
															/>
															<Typography variant="body1">
																{detail}
															</Typography>
														</Stack>
													)
												)}
											</Stack>
										</Box>
									)}

									{currentTab === 'specifications' && (
										<Grid
											container
											spacing={2}>
											{product.specifications?.map(
												(spec, index) => (
													<Grid
														item
														xs={6}
														key={index}>
														<Typography variant="subtitle1">
															{spec.key}:
														</Typography>
														<Typography
															variant="body2"
															color="text.secondary">
															{spec.value}
														</Typography>
													</Grid>
												)
											)}
										</Grid>
									)}

									{currentTab === 'reviews' && (
										<ReviewSection
											productId={product._id}
											reviews={reviews}
											handleSubmit={
												handleReviewSubmission
											}
										/>
									)}

									<Stack
										direction="row"
										spacing={2}
										sx={{ mt: 4 }}>
										<Button
											variant="contained"
											size="large"
											startIcon={
												<Iconify icon="mdi:cart-plus" />
											}
											disabled={!product.isInStock}
											sx={{ flex: 1, py: 2 }}
											onClick={handleAddToCart}>
											Add to Cart
										</Button>
										<IconButton
											onClick={handleAddToWishlist}
											color="primary"
											sx={{
												border: `1px solid ${theme.palette.divider}`,
												borderRadius: 2,
											}}>
											<Iconify
												icon={
													isInWishlist
														? 'mdi:heart'
														: 'mdi:heart-outline'
												}
											/>
										</IconButton>
									</Stack>

									<Stack
										direction="row"
										spacing={2}
										alignItems="center">
										<Typography variant="body2">
											Share:
										</Typography>
										<IconButton color="primary">
											<Iconify icon="mdi:facebook" />
										</IconButton>
										<IconButton color="primary">
											<Iconify icon="mdi:twitter" />
										</IconButton>
										<IconButton color="primary">
											<Iconify icon="mdi:instagram" />
										</IconButton>
									</Stack>
								</ProductInfoCard>
							</Grid>
						</Grid>
					</Box>

					{/* FAQ Section */}
					{currentTab === 'faq' && product.faqs?.length > 0 && (
						<Box sx={{ mt: 6 }}>
							<Typography
								variant="h4"
								gutterBottom>
								Frequently Asked Questions
							</Typography>
							{product.faqs.map((faq, index) => (
								<Box
									key={index}
									sx={{ mb: 3 }}>
									<Typography
										variant="subtitle1"
										sx={{ fontWeight: 600 }}>
										{faq.question}
									</Typography>
									<Typography
										variant="body1"
										color="text.secondary">
										{faq.answer}
									</Typography>
								</Box>
							))}
						</Box>
					)}
				</Container>
			</StyledRoot>
		)
	)
}
