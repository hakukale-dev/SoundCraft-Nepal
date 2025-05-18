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

import UserTableRow from './user-table-row'
import { SimpleDialogForm } from './user-form'
import TableHeader from '../../common/table-header'
import TableNoData from '../../common/table-no-data'
import TableToolbar from '../../common/table-toolbar'
import TableEmptyRows from '../../common/table-empty-rows'
import { emptyRows, applyFilter, getComparator } from '../../../utils/utils'

// ----------------------------------------------------------------------
export default function UserView() {
	const { user } = useSelector((state) => state.auth)

	const [page, setPage] = useState(0)
	const [order, setOrder] = useState('asc')
	const [selected, setSelected] = useState([])
	const [orderBy, setOrderBy] = useState('name')
	const [filterName, setFilterName] = useState('')
	const [rowsPerPage, setRowsPerPage] = useState(5)

	const [users, setUsers] = useState([])
	const [editingUser, setEditingUser] = useState({})

	const [isAdd, setIsAdd] = useState(true)
	const [open, setOpen] = useState(false)

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setEditingUser({})
		setOpen(false)
		setIsAdd(true)
	}

	const handleSort = (event, id) => {
		const isAsc = orderBy === id && order === 'asc'
		if (id) {
			setOrder(isAsc ? 'desc' : 'asc')
			setOrderBy(id)
		}
	}

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = users.map((n) => n._id)
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
		const userData = {
			first_name: data.first_name,
			last_name: data.last_name,
			username: data.username,
			email: data.email,
			password: data.password,
			address: {
				street: data.street,
				city: data.city,
				state: data.state,
				zip_code: data.zip_code,
			},
			phone_number: data.phone_number,
			dob: data.dob,
			is_admin: data.is_admin,
		}

		const request = isAdd
			? axios.post('api/account/user', userData, {
					headers: { Authorization: `Bearer ${user.token}` },
			  })
			: axios.patch(`api/account/user/${editingUser._id}`, userData, {
					headers: { Authorization: `Bearer ${user.token}` },
			  })

		request
			.then(() => {
				fetchData()
				toast.success(isAdd ? 'User Added' : 'Edit Success')
				handleClose()
			})
			.catch((error) => {
				console.error('Error:', error)
				toast.error(
					error.message ||
						(isAdd ? 'Failed to add user' : 'Failed to update user')
				)
			})
	}

	const handleEdit = (event, id) => {
		const userData = users.find((data) => data._id === id)
		setEditingUser(userData)
		setOpen(true)
		setIsAdd(false)
	}

	const handleDisable = (event, id) => {
		axios
			.put(`api/account/user/${id}/disable/`, {
				headers: { Authorization: `Bearer ${user.token}` },
			})
			.then(() => {
				fetchData()
				toast.success('User Disabled')
			})
			.catch(() => toast.error('Failed to disable user'))
	}

	const handleEnable = (event, id) => {
		axios
			.put(`api/account/user/${id}/enable/`, {
				headers: { Authorization: `Bearer ${user.token}` },
			})
			.then(() => {
				fetchData()
				toast.success('User Enabled')
			})
			.catch(() => toast.error('Failed to enable user'))
	}

	const dataFiltered = applyFilter({
		inputData: users,
		comparator: getComparator(order, orderBy),
		filterKey: 'username',
		filterValue: filterName,
	})

	const notFound = !dataFiltered.length && !!filterName

	const fetchData = useCallback(() => {
		axios
			.get('api/account/users', {
				headers: { Authorization: `Bearer ${user.token}` },
			})
			.then((res) => {
				setUsers(res.data)
			})
			.catch(() => toast.error('Failed to fetch users'))
	}, [user])

	useEffect(() => {
		fetchData()
	}, [user, fetchData])

	return (
		<Container>
			{open && (
				<SimpleDialogForm
					isAdd={isAdd}
					onClose={handleClose}
					onSubmit={handleSubmit}
					formData={editingUser}
				/>
			)}

			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				mb={5}>
				<Typography variant="h4">Users</Typography>

				<Button
					variant="contained"
					color="inherit"
					startIcon={<Iconify icon="eva:plus-fill" />}
					onClick={handleOpen}>
					New User
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
							order={order}
							orderBy={orderBy}
							rowCount={users.length}
							numSelected={selected.length}
							onRequestSort={handleSort}
							onSelectAllClick={handleSelectAllClick}
							headLabel={[
								{ id: 'username', label: 'Username' },
								{ id: 'email', label: 'Email' },
								{ id: 'phone_number', label: 'Phone' },
								{ id: 'is_disabled', label: 'Is Disabled' },
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
									<UserTableRow
										id={row._id}
										key={row._id}
										username={row.username}
										email={row.email}
										phone_number={row.phone_number}
										is_disabled={row.is_disabled}
										selected={
											selected.indexOf(row._id) !== -1
										}
										handleClick={(event) =>
											handleClick(event, row._id)
										}
										handleEdit={(event) =>
											handleEdit(event, row._id)
										}
										handleDisable={(event) =>
											handleDisable(event, row._id)
										}
										handleEnable={(event) =>
											handleEnable(event, row._id)
										}
									/>
								))}

							<TableEmptyRows
								height={77}
								emptyRows={emptyRows(
									page,
									rowsPerPage,
									users.length
								)}
							/>

							{notFound && <TableNoData query={filterName} />}
						</TableBody>
					</Table>
				</TableContainer>

				<TablePagination
					page={page}
					component="div"
					count={users.length}
					rowsPerPage={rowsPerPage}
					onPageChange={handleChangePage}
					rowsPerPageOptions={[5, 10, 25]}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Card>
		</Container>
	)
}
