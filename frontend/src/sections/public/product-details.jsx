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

export default function ProductDetailsPage() {
	const dispatch = useDispatch()
	const theme = useTheme()
	const navigate = useNavigate()
	const { id } = useParams()
	const [rawProductData, setRawProductData] = useState(null)
	const [product, setProduct] = useState(null)
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

		// Only fetch if id exists
		if (id) {
			fetchProduct()
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
											color="primary"
											sx={{
												border: `1px solid ${theme.palette.divider}`,
												borderRadius: 2,
											}}>
											<Iconify icon="mdi:heart-outline" />
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
