import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Box,
	Grid,
	Card,
	Stack,
	Typography,
	Container,
	CardMedia,
	CardContent,
	Skeleton,
	TextField,
	MenuItem,
	Button,
	IconButton,
	Tooltip,
	Pagination,
	Chip,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import axios from 'src/utils/axios'
import { Search, Close, ShoppingCart, Info } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/cartSlice'
import { toast } from 'react-toastify'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'

const MotionCard = motion(Card)
const MotionGrid = motion(Grid)

export default function ProductsView() {
	const theme = useTheme()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const location = useLocation()
	const [searchParams, setSearchParams] = useSearchParams()

	// State management
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [filterCategory, setFilterCategory] = useState(
		searchParams.get('category') || 'all'
	)
	const [searchQuery, setSearchQuery] = useState(
		searchParams.get('search') || ''
	)
	const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
	const productsPerPage = 12

	// Fetch products from API
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get('api/products')
				setProducts(response.data)
			} catch (err) {
				setError(
					err.response?.data?.message || 'Failed to fetch products'
				)
				toast.error('Failed to load products')
			} finally {
				setLoading(false)
			}
		}
		fetchProducts()
	}, [])

	// Sync state when URL search params change externally
	useEffect(() => {
		const params = new URLSearchParams(location.search)
		const newCategory = params.get('category') || 'all'
		const newSearch = params.get('search') || ''
		const newPage = params.get('page') ? Number(params.get('page')) : 1

		if (newCategory !== filterCategory) setFilterCategory(newCategory)
		if (newSearch !== searchQuery) setSearchQuery(newSearch)
		if (newPage !== page) setPage(newPage)
	}, [location.search])

	// Update URL search params when state changes by merging existing params
	useEffect(() => {
		const params = new URLSearchParams(location.search)

		// Update category param
		if (filterCategory && filterCategory !== 'all') {
			params.set('category', filterCategory)
		} else {
			params.delete('category')
		}

		// Update search query param
		if (searchQuery && searchQuery.trim() !== '') {
			params.set('search', searchQuery)
		} else {
			params.delete('search')
		}

		// Update page param
		if (page && page > 1) {
			params.set('page', page)
		} else {
			params.delete('page')
		}

		// Only navigate if the query string has changed
		if (params.toString() !== location.search.replace(/^\?/, '')) {
			navigate({ search: params.toString() }, { replace: true })
		}
	}, [filterCategory, searchQuery, page, navigate, location.search])

	// Memoize categories and filtered/paginated products
	const categories = useMemo(
		() => ['all', ...new Set(products.map((product) => product.category))],
		[products]
	)

	const filteredProducts = useMemo(
		() =>
			products.filter((product) => {
				const matchesCategory =
					filterCategory === 'all' ||
					product.category === filterCategory
				const searchLower = searchQuery.toLowerCase()
				return (
					matchesCategory &&
					(product.name.toLowerCase().includes(searchLower) ||
						product.model.toLowerCase().includes(searchLower) ||
						product.category.toLowerCase().includes(searchLower))
				)
			}),
		[products, filterCategory, searchQuery]
	)

	const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
	const paginatedProducts = useMemo(
		() =>
			filteredProducts.slice(
				(page - 1) * productsPerPage,
				page * productsPerPage
			),
		[filteredProducts, page, productsPerPage]
	)

	// Handlers
	const handlePageChange = useCallback((_, value) => {
		setPage(value)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [])

	const handleAddToCart = useCallback(
		(product) => {
			dispatch(
				addToCart({
					equipment_id: product._id,
					name: product.name,
					thumbnail: product.image,
					price_per: product.price,
				})
			)
			toast.success(`${product.name} added to cart!`)
		},
		[dispatch]
	)

	const handleClearSearch = useCallback(() => {
		setSearchQuery('')
		setFilterCategory('all')
		setPage(1)
	}, [])

	const handleViewDetails = useCallback(
		(productId) => {
			navigate(`/products/${productId}`)
		},
		[navigate]
	)

	// Loading and error states
	if (loading) {
		return (
			<Container sx={{ py: 8 }}>
				<Grid
					container
					spacing={4}>
					{[...Array(8)].map((_, i) => (
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={3}
							key={i}>
							<Skeleton
								variant="rectangular"
								height={300}
							/>
							<Skeleton
								variant="text"
								height={40}
							/>
							<Skeleton
								variant="text"
								width="60%"
							/>
							<Skeleton
								variant="text"
								width="40%"
							/>
						</Grid>
					))}
				</Grid>
			</Container>
		)
	}

	if (error) {
		return (
			<Container sx={{ py: 8, textAlign: 'center' }}>
				<Typography
					variant="h5"
					color="error"
					gutterBottom>
					Error Loading Products
				</Typography>
				<Typography color="text.secondary">{error}</Typography>
				<Button
					variant="contained"
					sx={{ mt: 3 }}
					onClick={() => window.location.reload()}>
					Retry
				</Button>
			</Container>
		)
	}

	return (
		<Container
			maxWidth="xl"
			sx={{ py: 8 }}>
			{/* Header Section */}
			<Stack
				spacing={3}
				mb={6}>
				<Typography
					variant="h2"
					sx={{ fontWeight: 800, textAlign: 'center' }}>
					Explore Our Collection
				</Typography>

				{/* Filters Section */}
				<Stack
					direction={{ xs: 'column', md: 'row' }}
					spacing={3}
					alignItems="center">
					<TextField
						select
						variant="outlined"
						label="Category"
						value={filterCategory}
						onChange={(e) => {
							setFilterCategory(e.target.value)
							setPage(1)
						}}
						sx={{
							minWidth: 200,
							'& .MuiOutlinedInput-root': {
								borderRadius: 4,
								boxShadow: theme.shadows[1],
							},
						}}>
						{categories.map((category) => (
							<MenuItem
								key={category}
								value={category}>
								{category.charAt(0).toUpperCase() +
									category.slice(1)}
							</MenuItem>
						))}
					</TextField>
					<TextField
						fullWidth
						variant="outlined"
						placeholder="Search instruments..."
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value)
							setPage(1)
						}}
						InputProps={{
							startAdornment: (
								<Search
									sx={{ mr: 1, color: 'action.active' }}
								/>
							),
							endAdornment: searchQuery && (
								<IconButton
									size="small"
									onClick={handleClearSearch}>
									<Close />
								</IconButton>
							),
						}}
						sx={{
							maxWidth: 600,
							'& .MuiOutlinedInput-root': {
								borderRadius: 4,
								boxShadow: theme.shadows[1],
							},
						}}
					/>
				</Stack>

				<Typography
					variant="body1"
					color="text.secondary"
					textAlign="center">
					Showing {filteredProducts.length} of {products.length}{' '}
					instruments
				</Typography>
			</Stack>

			{/* Products Grid */}
			{paginatedProducts.length > 0 ? (
				<>
					<Grid
						container
						spacing={4}>
						<AnimatePresence initial={false}>
							{paginatedProducts.map((product) => (
								<MotionGrid
									key={product._id}
									item
									xs={12}
									sm={6}
									md={4}
									lg={3}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}>
									<MotionCard
										whileHover={{ scale: 1.02 }}
										sx={{
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
											borderRadius: 4,
											overflow: 'hidden',
											boxShadow: theme.shadows[2],
											transition: 'all 0.3s ease',
											'&:hover': {
												boxShadow: theme.shadows[6],
											},
										}}>
										{/* Product Image */}
										<Box
											sx={{
												position: 'relative',
												pt: '100%',
												bgcolor: 'background.default',
											}}>
											<CardMedia
												component="img"
												image={
													product.image ||
													'/assets/images/placeholder.png'
												}
												alt={product.name}
												sx={{
													position: 'absolute',
													top: 0,
													left: 0,
													width: '100%',
													height: '100%',
													objectFit: 'cover',
													transition:
														'transform 0.3s ease',
													'&:hover': {
														transform:
															'scale(1.05)',
													},
												}}
											/>
											{product.stock <= 0 && (
												<Box
													sx={{
														position: 'absolute',
														top: 0,
														left: 0,
														right: 0,
														bottom: 0,
														bgcolor:
															'rgba(0,0,0,0.4)',
														display: 'flex',
														alignItems: 'center',
														justifyContent:
															'center',
													}}>
													<Chip
														label="Out of Stock"
														color="error"
														sx={{ fontWeight: 700 }}
													/>
												</Box>
											)}
										</Box>

										{/* Product Details */}
										<CardContent sx={{ flexGrow: 1, p: 3 }}>
											<Stack spacing={1.5}>
												<Typography
													variant="h6"
													fontWeight={700}
													noWrap>
													{product.name}
												</Typography>

												<Stack
													direction="row"
													spacing={1}
													alignItems="center">
													<Typography
														variant="body2"
														color="text.secondary">
														{product.category}
													</Typography>
													<Typography
														variant="body2"
														color="text.secondary">
														•
													</Typography>
													<Typography
														variant="body2"
														color="text.secondary">
														{product.model}
													</Typography>
												</Stack>

												<Typography
													variant="h5"
													fontWeight={800}
													color="primary">
													Rs.{' '}
													{product.price.toLocaleString()}
												</Typography>

												<Stack
													direction="row"
													justifyContent="space-between"
													alignItems="center">
													<Chip
														label={`${product.stock} in stock`}
														size="small"
														color={
															product.stock > 0
																? 'success'
																: 'error'
														}
														sx={{ fontWeight: 500 }}
													/>

													<Stack
														direction="row"
														spacing={1}>
														<Tooltip title="Quick View">
															<IconButton
																color="primary"
																onClick={() =>
																	handleViewDetails(
																		product._id
																	)
																}>
																<Info />
															</IconButton>
														</Tooltip>
														<Tooltip title="Add to Cart">
															<IconButton
																color="primary"
																onClick={() =>
																	handleAddToCart(
																		product
																	)
																}
																disabled={
																	product.stock <=
																	0
																}>
																<ShoppingCart />
															</IconButton>
														</Tooltip>
													</Stack>
												</Stack>
											</Stack>
										</CardContent>
									</MotionCard>
								</MotionGrid>
							))}
						</AnimatePresence>
					</Grid>

					{/* Pagination */}
					{totalPages > 1 && (
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								mt: 6,
							}}>
							<Pagination
								count={totalPages}
								page={page}
								onChange={handlePageChange}
								color="primary"
								size="large"
								shape="rounded"
								sx={{
									'& .MuiPaginationItem-root': {
										fontSize: '1.1rem',
										borderRadius: 2,
									},
								}}
							/>
						</Box>
					)}
				</>
			) : (
				<Box sx={{ textAlign: 'center', py: 8 }}>
					<Typography
						variant="h5"
						gutterBottom>
						No products found
					</Typography>
					<Typography
						color="text.secondary"
						sx={{ mb: 3 }}>
						Try adjusting your search or filters
					</Typography>
					<Button
						variant="outlined"
						startIcon={<Close />}
						onClick={handleClearSearch}>
						Clear Filters
					</Button>
				</Box>
			)}
		</Container>
	)
}
