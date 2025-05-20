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
import TableNoData from '../../common/table-no-data'
import TableToolbar from '../../common/table-toolbar'
import TableEmptyRows from '../../common/table-empty-rows'
import { emptyRows, applyFilter, getComparator } from '../../../utils/utils'
import QueryInfoPopup from './query-info'

// ----------------------------------------------------------------------
export default function QueriesView() {
	const { user } = useSelector((state) => state.auth)

	const [page, setPage] = useState(0)
	const [order, setOrder] = useState('asc')
	const [selected, setSelected] = useState([])
	const [orderBy, setOrderBy] = useState('name')
	const [filterName, setFilterName] = useState('')
	const [rowsPerPage, setRowsPerPage] = useState(5)

	const [queries, setQueries] = useState([])
	const [infoQuery, setInfoQuery] = useState(null)
	const [infoOpen, setInfoOpen] = useState(false)

	const handleInfoOpen = (query) => {
		setInfoQuery(query)
		setInfoOpen(true)
	}

	const handleInfoClose = () => {
		setInfoQuery(null)
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
			const newSelecteds = queries.map((n) => n.id)
			setSelected(newSelecteds)
			return
		}
		setSelected([])
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

	const handleDelete = (event, id) => {
		axios
			.delete(`api/reach-us/${id}/`)
			.then(() => {
				toast.success('Query deleted successfully')
				fetchData()
			})
			.catch((err) => {
				toast.error('Failed to delete query')
				console.error(err)
			})
	}

	const handleInfoPopup = (event, id) => {
		const queryData = queries.find((data) => data._id === id)
		if (queryData) {
			handleInfoOpen(queryData)
		}
	}

	const dataFiltered = applyFilter({
		inputData: queries,
		comparator: getComparator(order, orderBy),
		filterKey: 'name',
		filterValue: filterName,
	})

	const notFound = !dataFiltered.length && !!filterName

	const fetchData = useCallback(
		() =>
			axios
				.get('api/reach-us')
				.then((res) => {
					setQueries(res.data)
				})
				.catch((err) => {
					toast.error('Failed to fetch queries')
					console.error(err)
				}),
		[]
	)

	useEffect(() => {
		fetchData()
	}, [fetchData])

	return (
		<Container>
			{infoQuery && (
				<QueryInfoPopup
					query={infoQuery}
					open={infoOpen}
					onClose={handleInfoClose}
					onDelete={(e) => {
						handleInfoClose()
						handleDelete(e, infoQuery._id)
					}}
				/>
			)}

			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				mb={5}>
				<Typography variant="h4">Customer Queries</Typography>
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
							rowCount={queries.length}
							numSelected={selected.length}
							onRequestSort={handleSort}
							onSelectAllClick={handleSelectAllClick}
							headLabel={[
								{
									id: 'name',
									label: 'Name',
									align: 'center',
								},
								{ id: 'email', label: 'Email' },
								{ id: 'message', label: 'Message' },
								{ id: 'createdAt', label: 'Date' },
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
									<tr key={row._id}>
										<td align="center">{row.name}</td>
										<td>{row.email}</td>
										<td>
											{row.message.substring(0, 50)}...
										</td>
										<td>
											{new Date(
												row.createdAt
											).toLocaleDateString()}
										</td>
										<td>
											<Button
												variant="text"
												onClick={(e) =>
													handleInfoPopup(e, row._id)
												}>
												View
											</Button>
											<Button
												variant="text"
												color="error"
												onClick={(e) =>
													handleDelete(e, row._id)
												}>
												Delete
											</Button>
										</td>
									</tr>
								))}

							<TableEmptyRows
								height={77}
								emptyRows={emptyRows(
									page,
									rowsPerPage,
									queries.length
								)}
							/>

							{notFound && <TableNoData query={filterName} />}
						</TableBody>
					</Table>
				</TableContainer>

				<TablePagination
					page={page}
					component="div"
					count={queries.length}
					rowsPerPage={rowsPerPage}
					onPageChange={handleChangePage}
					rowsPerPageOptions={[5, 10, 25]}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Card>
		</Container>
	)
}
