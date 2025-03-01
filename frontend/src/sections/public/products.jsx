import { useState, useEffect } from 'react'
import {
	Box,
	Grid,
	Card,
	Stack,
	Typography,
	Container,
	CardMedia,
	CardContent,
	CircularProgress,
	TextField,
	MenuItem,
	Button,
	IconButton,
	Tooltip,
	Pagination,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import axiosInstance from 'src/utils/axios'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import AddShoppingCart from '@mui/icons-material/AddShoppingCart'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/cartSlice'
import { toast } from 'react-toastify'

export default function ProductsView() {
	const theme = useTheme()
	const dispatch = useDispatch()
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [filterCategory, setFilterCategory] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')
	const [page, setPage] = useState(1)
	const productsPerPage = 8

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axiosInstance().get('api/products')
				setProducts(response.data)
			} catch (err) {
				setError(
					err.response?.data?.message || 'Failed to fetch products'
				)
			} finally {
				setLoading(false)
			}
		}

		fetchProducts()
	}, [])

	const categories = [
		'all',
		...new Set(products.map((product) => product.category)),
	]

	const handleClearSearch = () => {
		setSearchQuery('')
		setFilterCategory('all')
		setPage(1)
	}

	const filteredProducts = products.filter((product) => {
		const matchesCategory =
			filterCategory === 'all' || product.category === filterCategory
		const matchesSearch =
			product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.category.toLowerCase().includes(searchQuery.toLowerCase())
		return matchesCategory && matchesSearch
	})

	// Calculate pagination
	const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
	const startIndex = (page - 1) * productsPerPage
	const paginatedProducts = filteredProducts.slice(
		startIndex,
		startIndex + productsPerPage
	)

	const handlePageChange = (event, value) => {
		setPage(value)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const handleAddToCart = (product) => {
		dispatch(
			addToCart({
				equipment_id: product._id,
				name: product.name,
				thumbnail: product.image,
				price_per: product.price,
			})
		)
        toast.success("Items added to cart!")
	}

	if (loading) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: 'calc(100vh - 100px)',
				}}>
				<CircularProgress sx={{ color: theme.palette.primary.main }} />
			</Box>
		)
	}

	if (error) {
		return (
			<Container sx={{ mt: '100px' }}>
				<Typography
					variant="h6"
					color="error"
					align="center"
					fontFamily={theme.typography.fontFamily}>
					{error}
				</Typography>
			</Container>
		)
	}

	return (
		<Container
			maxWidth="xl"
			sx={{ mt: '120px' }}>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				mb={5}>
				<Typography
					variant="h4"
					fontFamily={theme.typography.fontFamily}
					color={theme.palette.primary.main}
					sx={{
						fontSize: '2.5rem',
						fontWeight: 600,
					}}>
					Our Musical Instruments
				</Typography>
				<Typography
					variant="body1"
					color="text.secondary">
					Showing {filteredProducts.length} of {products.length}{' '}
					products
				</Typography>
			</Stack>

			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={3}
				mb={4}>
				<Stack
					direction="column"
					spacing={2}
					sx={{ width: { xs: '100%', sm: 'auto' } }}>
					<TextField
						label="Search"
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value)
							setPage(1)
						}}
						placeholder="Search by name, model or category"
						sx={{ minWidth: 250 }}
						InputProps={{
							endAdornment: searchQuery && (
								<IconButton
									size="small"
									onClick={handleClearSearch}>
									<ClearIcon />
								</IconButton>
							),
						}}
					/>
					<Stack
						direction="row"
						spacing={2}>
						<TextField
							select
							label="Category"
							value={filterCategory}
							onChange={(e) => {
								setFilterCategory(e.target.value)
								setPage(1)
							}}
							sx={{ minWidth: 150 }}>
							{categories.map((category) => (
								<MenuItem
									key={category}
									value={category}>
									{category.charAt(0).toUpperCase() +
										category.slice(1)}
								</MenuItem>
							))}
						</TextField>
						<Tooltip title="Apply filters">
							<Button
								variant="contained"
								color="primary"
								startIcon={<SearchIcon />}
								onClick={() => {
									/* Add search functionality if needed */
								}}>
								Search
							</Button>
						</Tooltip>
					</Stack>
				</Stack>
			</Stack>

			<Grid
				container
				spacing={3}>
				{paginatedProducts.map((product) => (
					<Grid
						key={product._id}
						item
						xs={12}
						sm={6}
						md={4}
						lg={3}>
						<Card
							sx={{
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								transition: 'all 0.3s ease-in-out',
								borderRadius: 2,
								bgcolor: theme.palette.background.paper,
								'&:hover': {
									transform: 'translateY(-8px)',
									boxShadow: theme.shadows[8],
								},
							}}>
							<Box
								sx={{
									position: 'relative',
									width: '100%',
									paddingTop: '100%',
									backgroundColor: 'white',
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
										borderBottom: `1px solid ${theme.palette.divider}`,
										transition:
											'object-fit 0.3s ease-in-out',
										'&:hover': {
											objectFit: 'contain',
										},
									}}
								/>
							</Box>
							<CardContent sx={{ flexGrow: 1, p: 3 }}>
								<Typography
									gutterBottom
									variant="h6"
									component="div"
									fontFamily={theme.typography.fontFamily}
									color={theme.palette.primary.main}
									sx={{
										fontSize: '1.25rem',
										fontWeight: 600,
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}}>
									{product.name}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
									mb={1}
									sx={{
										fontFamily: theme.typography.fontFamily,
									}}>
									Model: {product.model}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
									mb={2}
									sx={{
										fontFamily: theme.typography.fontFamily,
									}}>
									Category: {product.category}
								</Typography>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}>
									<Typography
										variant="h6"
										color={theme.palette.primary.main}
										sx={{
											fontFamily:
												theme.typography.fontFamily,
											fontSize: '1.5rem',
											fontWeight: 600,
										}}>
										${product.price.toLocaleString()}
									</Typography>
									<Tooltip title="Add to Cart">
										<IconButton
											color="primary"
											onClick={() =>
												handleAddToCart(product)
											}>
											<AddShoppingCart />
										</IconButton>
									</Tooltip>
								</Box>
								<Typography
									variant="body2"
									sx={{
										color:
											product.stock > 0
												? theme.palette.success.main
												: theme.palette.error.main,
										fontFamily: theme.typography.fontFamily,
										mt: 1,
										fontWeight: 500,
									}}>
									{product.stock > 0
										? `${product.stock} In Stock`
										: 'Out of Stock'}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>

			{totalPages > 1 && (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						mt: 5,
						mb: 3,
					}}>
					<Pagination
						count={totalPages}
						page={page}
						onChange={handlePageChange}
						color="primary"
						size="large"
						sx={{
							'& .MuiPaginationItem-root': {
								fontFamily: theme.typography.fontFamily,
							},
						}}
					/>
				</Box>
			)}
		</Container>
	)
}
