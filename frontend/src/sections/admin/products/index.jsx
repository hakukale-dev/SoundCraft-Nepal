import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'

import axios from 'src/utils/axios'

import Iconify from 'src/components/iconify'
import Scrollbar from 'src/components/scrollbar'

import TableHeader from '../../common/table-header'
import CustomTableRow from './products-table-row'
import { SimpleDialogForm } from './products-form'
import TableNoData from '../../common/table-no-data'
import TableToolbar from '../../common/table-toolbar'
import TableEmptyRows from '../../common/table-empty-rows'
import { emptyRows, applyFilter, getComparator } from '../../../utils/utils'
import ProductInfoPopup from './product-info'

// ----------------------------------------------------------------------
export default function ProductsView() {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const { user } = useSelector((state) => state.auth)

	const [page, setPage] = useState(0)
	const [order, setOrder] = useState('asc')
	const [selected, setSelected] = useState([])
	const [orderBy, setOrderBy] = useState('name')
	const [filterName, setFilterName] = useState('')
	const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 3 : 5)

	const [products, setProducts] = useState([])
	const [editingProduct, setEditingProduct] = useState({})
	const [infoProduct, setInfoProduct] = useState(null)

	const [isAdd, setisAdd] = useState(true)
	const [open, setOpen] = useState(false)
	const [infoOpen, setInfoOpen] = useState(false)

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setEditingProduct({})
		setOpen(false)
		setisAdd(true)
	}

	const handleInfoOpen = (product) => {
		setInfoProduct(product)
		setInfoOpen(true)
	}

	const handleInfoClose = () => {
		setInfoProduct(null)
		setInfoOpen(false)
	}

	const handleSort = (event, id) => {
		const isAsc = orderBy === id && order === 'asc'
		if (id !== '') {
			setOrder(isAsc ? 'desc' : 'asc')
			setOrderBy(id)
		}
	}

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = products.map((n) => n.id)
			setSelected(newSelecteds)
			return
		}
		setSelected([])
	}

	const handleClick = (event, id) => {
		const selectedIndex = selected.indexOf(id)

		let newSelected = []
		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id)
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			)
		}
		setSelected(newSelected)
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = (event) => {
		setPage(0)
		setRowsPerPage(parseInt(event.target.value, 10))
	}

	const handleFilterByName = (event) => {
		setPage(0)
		setFilterName(event.target.value)
	}

	const handleSubmit = (data) => {
		const formData = new FormData()
		formData.append('name', data.name)
		formData.append('model', data.model)
		formData.append('description', data.description)
		formData.append('price', data.price)
		formData.append('category', data.category)
		formData.append('stock', data.stock)

		if (data.image && data.image.length > 0) {
			formData.append('image', data.image[0])
		}

		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}

		if (isAdd) {
			axios
				.post('api/products/', formData, config)
				.then(() => {
					toast.success('Product Added')
					handleClose()
					fetchData()
				})
				.catch((err) => {
					toast.error('Failed to add product')
					console.log(err)
				})
		} else {
			axios
				.put(`api/products/${editingProduct._id}/`, formData, config)
				.then(() => {
					toast.success('Edit Success')
					handleClose()
					fetchData()
				})
				.catch((e) => {
					toast.error('Failed to edit product')
					console.log(`Failed: ${e}`)
				})
		}
	}

	const handleEdit = (event, id) => {
		const productData = products.filter((data) => data._id === id)[0]
		setEditingProduct(productData)
		setOpen(true)
		setisAdd(false)
	}

	const handleDelete = (event, id) => {
		axios
			.delete(`api/products/${id}/`)
			.then(() => {
				toast.success('Deleted Successfully')
				fetchData()
			})
			.catch((err) => {
				toast.error('Failed to delete product')
				console.log(err)
			})
	}

	const handleInfoPopup = (event, id) => {
		const productData = products.filter((data) => data._id === id)[0]
		handleInfoOpen(productData)
	}

	const dataFiltered = applyFilter({
		inputData: products,
		comparator: getComparator(order, orderBy),
		filterKey: 'name',
		filterValue: filterName,
	})

	const notFound = !dataFiltered.length && !!filterName

	const fetchData = useCallback(
		() =>
			axios
				.get('api/products')
				.then((res) => {
					setProducts(res.data)
				})
				.catch((err) => {
					toast.error('Failed to fetch products')
					console.log(err)
				}),
		[]
	)

	useEffect(() => {
		fetchData()
	}, [fetchData])

	return (
		<Container maxWidth={isMobile ? 'sm' : 'xl'}>
			{open && (
				<SimpleDialogForm
					isAdd={isAdd}
					onClose={handleClose}
					onSubmit={handleSubmit}
					formData={editingProduct}
				/>
			)}

			{infoProduct && (
				<ProductInfoPopup
					product={infoProduct}
					open={infoOpen}
					onClose={handleInfoClose}
					onEdit={(e) => {
						handleInfoClose()
						handleEdit(e, infoProduct._id)
					}}
				/>
			)}

			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				mb={5}>
				<Typography variant={isMobile ? 'h5' : 'h4'}>
					Products
				</Typography>

				<Button
					variant="contained"
					color="inherit"
					size={isMobile ? 'small' : 'medium'}
					startIcon={<Iconify icon="eva:plus-fill" />}
					onClick={handleOpen}>
					{isMobile ? 'New' : 'New Product'}
				</Button>
			</Stack>

			<Card sx={{ overflowX: 'auto' }}>
				<TableToolbar
					numSelected={selected.length}
					filterName={filterName}
					onFilterName={handleFilterByName}
				/>

				<TableContainer
					component={Scrollbar}
					sx={{ maxHeight: 440 }}>
					<Table
						stickyHeader
						sx={{ minWidth: isMobile ? 600 : 800 }}>
						<TableHeader
							showCheckBox={false}
							order={order}
							orderBy={orderBy}
							rowCount={products.length}
							numSelected={selected.length}
							onRequestSort={handleSort}
							onSelectAllClick={handleSelectAllClick}
							headLabel={[
								{
									id: 'image',
									label: 'Product Image',
								},
								{
									id: 'name',
									label: 'Product Name',
									align: 'center',
								},
								{ id: 'model', label: 'Model' },
								{ id: 'price', label: 'Price' },
								{ id: 'category', label: 'Category' },
								{ id: 'stock', label: 'Stock' },
								{ id: '', label: '' },
							]}
						/>
						<TableBody>
							{dataFiltered
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map((row) => (
									<CustomTableRow
										key={row._id}
										name={row.name}
										model={row.model}
										category={row.category}
										price={row.price}
										image={row.image}
										stock={row.stock}
										selected={
											selected.indexOf(row._id) !== -1
										}
										handleClick={(event) =>
											handleClick(event, row._id)
										}
										handleEdit={(event) =>
											handleEdit(event, row._id)
										}
										handleDelete={(event) =>
											handleDelete(event, row._id)
										}
										handleInfoPopup={(event) =>
											handleInfoPopup(event, row._id)
										}
										showPopover
										isMobile={isMobile}
									/>
								))}

							<TableEmptyRows
								height={77}
								emptyRows={emptyRows(
									page,
									rowsPerPage,
									products.length
								)}
							/>

							{notFound && <TableNoData query={filterName} />}
						</TableBody>
					</Table>
				</TableContainer>

				<TablePagination
					page={page}
					component="div"
					count={products.length}
					rowsPerPage={rowsPerPage}
					onPageChange={handleChangePage}
					rowsPerPageOptions={isMobile ? [3, 5, 10] : [5, 10, 25]}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Card>
		</Container>
	)
}
