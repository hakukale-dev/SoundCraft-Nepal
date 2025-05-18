import { useState } from 'react'
import PropTypes from 'prop-types'

import Stack from '@mui/material/Stack'
import Popover from '@mui/material/Popover'
import TableRow from '@mui/material/TableRow'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import Iconify from 'src/components/iconify'

// ----------------------------------------------------------------------

export default function QueryTableRow({
	id,
	selected,
	name,
	email,
	message,
	createdAt,
	handleDelete,
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
				selected={selected}>
				<TableCell align="center">
					<Typography variant="subtitle2">{name}</Typography>
				</TableCell>
				<TableCell>{email}</TableCell>
				<TableCell>
					<Typography noWrap>
						{message.substring(0, 50)}...
					</Typography>
				</TableCell>
				<TableCell>
					{new Date(createdAt).toLocaleDateString()}
				</TableCell>
				<TableCell align="right">
					<Button
						variant="text"
						onClick={(e) => handleInfoPopup(e, id)}>
						View
					</Button>
					<Button
						variant="text"
						color="error"
						onClick={(e) => handleDelete(e, id)}>
						Delete
					</Button>
				</TableCell>
			</TableRow>
		</>
	)
}

QueryTableRow.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	createdAt: PropTypes.string.isRequired,
	selected: PropTypes.bool,
	handleDelete: PropTypes.func.isRequired,
	handleInfoPopup: PropTypes.func.isRequired,
}
