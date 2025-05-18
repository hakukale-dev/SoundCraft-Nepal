import { useState } from 'react'
import PropTypes from 'prop-types'

import Stack from '@mui/material/Stack'
import Popover from '@mui/material/Popover'
import TableRow from '@mui/material/TableRow'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'

import Iconify from 'src/components/iconify'

// ----------------------------------------------------------------------

export default function OrdersTableRow({
	selected,
	user,
	createdAt,
	total,
	status,
	handleClick,
	handleInfoPopup,
}) {
	const [open, setOpen] = useState(null)

	const handleOpenMenu = (event) => {
		setOpen(event.currentTarget)
	}

	const handleCloseMenu = () => {
		setOpen(null)
	}

	return (
		<>
			<TableRow
				hover
				tabIndex={-1}
				role="checkbox"
				selected={selected}
				onClick={handleClick}>
				<TableCell>
					<Typography variant="subtitle2">
						{user || 'Guest'}
					</Typography>
				</TableCell>

				<TableCell align="center">
					{new Date(createdAt).toLocaleDateString()}
				</TableCell>

				<TableCell>${total.toFixed(2)}</TableCell>

				<TableCell>
					<Chip
						label={status}
						color={
							status === 'completed'
								? 'success'
								: status === 'pending'
								? 'warning'
								: 'error'
						}
					/>
				</TableCell>

				<TableCell align="right">
					<IconButton onClick={handleOpenMenu}>
						<Iconify icon="eva:more-vertical-fill" />
					</IconButton>
				</TableCell>
			</TableRow>

			<Popover
				open={!!open}
				anchorEl={open}
				onClose={handleCloseMenu}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				PaperProps={{
					sx: { width: 140 },
				}}>
				<MenuItem onClick={handleInfoPopup}>
					<Iconify
						icon="eva:info-outline"
						sx={{ mr: 2 }}
					/>
					Info
				</MenuItem>
			</Popover>
		</>
	)
}

OrdersTableRow.propTypes = {
	selected: PropTypes.bool,
	user: PropTypes.object,
	createdAt: PropTypes.string.isRequired,
	total: PropTypes.number.isRequired,
	status: PropTypes.string.isRequired,
	handleClick: PropTypes.func,
	handleInfoPopup: PropTypes.func,
}
