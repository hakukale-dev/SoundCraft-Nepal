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

import Iconify from 'src/components/iconify'
import Scrollbar from 'src/components/scrollbar'

import BillingTableRow from './billing-table-row'
import TableHeader from '../../common/table-header'
import TableNoData from '../../common/table-no-data'
import TableToolbar from '../../common/table-toolbar'
import TableEmptyRows from '../../common/table-empty-rows'
import { emptyRows, applyFilter, getComparator } from '../../../utils/utils'

// ----------------------------------------------------------------------
export default function BillingView() {
	const { user } = useSelector((state) => state.auth)

	const [page, setPage] = useState(0)
	const [order, setOrder] = useState('asc')
	const [selected, setSelected] = useState([])
	const [orderBy, setOrderBy] = useState('payment_reference_id')
	const [filterName, setFilterName] = useState('')
	const [rowsPerPage, setRowsPerPage] = useState(5)

	const [billingHistories, setBillingHistories] = useState([])

	const handleSort = (event, id) => {
		const isAsc = orderBy === id && order === 'asc'
		if (id) {
			setOrder(isAsc ? 'desc' : 'asc')
			setOrderBy(id)
		}
	}

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = billingHistories.map((n) => n._id)
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

	const dataFiltered = applyFilter({
		inputData: billingHistories,
		comparator: getComparator(order, orderBy),
		filterKey: 'payment_reference_id',
		filterValue: filterName,
	})

	const notFound = !dataFiltered.length && !!filterName

	const fetchData = useCallback(() => {
		axios
			.get('api/billing', {
				headers: { Authorization: `Bearer ${user.token}` },
			})
			.then((res) => {
				setBillingHistories(res.data)
			})
			.catch(() => toast.error('Failed to fetch billing histories'))
	}, [user])

	useEffect(() => {
		fetchData()
	}, [user, fetchData])

	return (
		<Container>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				mb={5}>
				<Typography variant="h4">Billing Histories</Typography>
			</Stack>

			<Card>
				<TableToolbar
					numSelected={selected.length}
					filterName={filterName}
					onFilterName={handleFilterByName}
				/>

				<Scrollbar>
					<TableContainer sx={{ overflow: 'unset' }}>
						<Table sx={{ minWidth: 800 }}>
							<TableHeader
								order={order}
								orderBy={orderBy}
								rowCount={billingHistories.length}
								numSelected={selected.length}
								onRequestSort={handleSort}
								onSelectAllClick={handleSelectAllClick}
								headLabel={[
									{
										id: 'payment_reference_id',
										label: 'Reference ID',
									},
									{ id: 'user_id', label: 'User' },
									{
										id: 'payment_method',
										label: 'Payment Method',
									},
									{ id: 'amount', label: 'Amount' },
									{ id: 'status', label: 'Status' },
									{ id: 'createdAt', label: 'Date' },
									{ id: '' },
								]}
							/>
							<TableBody>
								{dataFiltered
									.slice(
										page * rowsPerPage,
										page * rowsPerPage + rowsPerPage
									)
									.map((row) => (
										<BillingTableRow
											id={row._id}
											key={row._id}
											payment_reference_id={
												row.payment_reference_id
											}
											user_id={
												row.user_id?.username || 'N/A'
											}
											payment_method={row.payment_method}
											amount={row.amount}
											status={row.status}
											createdAt={new Date(
												row.createdAt
											).toLocaleDateString()}
											selected={
												selected.indexOf(row._id) !== -1
											}
											handleClick={(event) =>
												handleClick(event, row._id)
											}
										/>
									))}

								<TableEmptyRows
									height={77}
									emptyRows={emptyRows(
										page,
										rowsPerPage,
										billingHistories.length
									)}
								/>

								{notFound && <TableNoData query={filterName} />}
							</TableBody>
						</Table>
					</TableContainer>
				</Scrollbar>

				<TablePagination
					page={page}
					component="div"
					count={billingHistories.length}
					rowsPerPage={rowsPerPage}
					onPageChange={handleChangePage}
					rowsPerPageOptions={[5, 10, 25]}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Card>
		</Container>
	)
}
