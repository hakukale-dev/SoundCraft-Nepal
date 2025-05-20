import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useState, useEffect, useCallback } from 'react'

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

import TableHeader from '../../common/table-header'
import CustomTableRow from './orders-table-row'
import TableNoData from '../../common/table-no-data'
import TableToolbar from '../../common/table-toolbar'
import TableEmptyRows from '../../common/table-empty-rows'
import { emptyRows, applyFilter, getComparator } from '../../../utils/utils'
import OrderInfoPopup from './order-info'

// ----------------------------------------------------------------------
export default function OrdersView() {
	const { user } = useSelector((state) => state.auth)

	const [page, setPage] = useState(0)
	const [order, setOrder] = useState('asc')
	const [selected, setSelected] = useState([])
	const [orderBy, setOrderBy] = useState('createdAt')
	const [filterName, setFilterName] = useState('')
	const [rowsPerPage, setRowsPerPage] = useState(5)

	const [orders, setOrders] = useState([])
	const [infoOrder, setInfoOrder] = useState(null)
	const [infoOpen, setInfoOpen] = useState(false)

	const handleInfoOpen = (order) => {
		setInfoOrder(order)
		setInfoOpen(true)
	}

	const handleInfoClose = () => {
		setInfoOrder(null)
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
			const newSelecteds = orders.map((n) => n._id)
			setSelected(newSelecteds)
			return
		}
		setSelected([])
	}

	const handleClick = (event, id) => {
		const selectedIndex = selected.indexOf(id)
		const newSelected =
			selectedIndex === -1
				? [...selected, id]
				: selected.filter((item) => item !== id)
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

	const handleInfoPopup = (event, id) => {
		const orderData = orders.find((data) => data._id === id)
		handleInfoOpen(orderData)
	}

	const dataFiltered = applyFilter({
		inputData: orders,
		comparator: getComparator(order, orderBy),
		filterKey: 'user_id',
		filterValue: filterName,
		filterFn: (order, filterValue) => {
			if (!order.user_id) return false
			const fullName = `${order.user_id.first_name || ''} ${
				order.user_id.last_name || ''
			}`.toLowerCase()
			return fullName.includes(filterValue.toLowerCase())
		},
	})

	const notFound = !dataFiltered.length && !!filterName

	const fetchData = useCallback(async () => {
		try {
			const res = await axios.get('api/billing/admin')
			setOrders(res.data)
		} catch (err) {
			toast.error('Failed to fetch orders')
			console.error(err)
		}
	}, [])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const getUserName = (user) => {
		if (!user) return 'Guest'
		if (user.first_name && user.last_name)
			return `${user.first_name} ${user.last_name}`
		return user.username || 'Unknown'
	}

	return (
		<Container>
			{infoOrder && (
				<OrderInfoPopup
					order={infoOrder}
					open={infoOpen}
					onClose={handleInfoClose}
				/>
			)}

			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				mb={5}>
				<Typography variant="h4">Orders</Typography>
				<Button
					variant="contained"
					color="inherit"
					onClick={fetchData}>
					Refresh
				</Button>
			</Stack>

			<Card>
				<TableToolbar
					numSelected={selected.length}
					filterName={filterName}
					onFilterName={handleFilterByName}
				/>

				<TableContainer sx={{ overflow: 'unset' }}>
					<Table sx={{ minWidth: 800 }}>
						<TableHeader
							showCheckBox={false}
							order={order}
							orderBy={orderBy}
							rowCount={orders.length}
							numSelected={selected.length}
							onRequestSort={handleSort}
							onSelectAllClick={handleSelectAllClick}
							headLabel={[
								{ id: 'user', label: 'Customer' },
								{
									id: 'createdAt',
									label: 'Date',
									align: 'center',
								},
								{ id: 'amount', label: 'Amount' },
								{ id: 'status', label: 'Status' },
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
										user={getUserName(row.user_id)}
										createdAt={new Date(
											row.createdAt
										).toLocaleDateString()}
										total={row.amount}
										status={row.status}
										selected={selected.includes(row._id)}
										handleClick={(event) =>
											handleClick(event, row._id)
										}
										handleInfoPopup={(event) =>
											handleInfoPopup(event, row._id)
										}
										showPopover
									/>
								))}

							<TableEmptyRows
								height={77}
								emptyRows={emptyRows(
									page,
									rowsPerPage,
									orders.length
								)}
							/>

							{notFound && <TableNoData query={filterName} />}
						</TableBody>
					</Table>
				</TableContainer>

				<TablePagination
					page={page}
					component="div"
					count={orders.length}
					rowsPerPage={rowsPerPage}
					onPageChange={handleChangePage}
					rowsPerPageOptions={[5, 10, 25]}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Card>
		</Container>
	)
}
