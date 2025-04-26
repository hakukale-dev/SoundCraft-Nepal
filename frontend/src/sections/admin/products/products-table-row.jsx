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

export default function ProductTableRow({
	selected,
	name,
	model,
	price,
	category,
	stock,
	image,
	handleEdit,
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
				selected={selected}
				sx={{ height: '180px' }}>
				<TableCell
					component="th"
					scope="row"
					sx={{ padding: 2, textAlign: 'center' }}>
					<Stack
						direction="row"
						alignItems="center"
						spacing={2}>
						<img
							alt={name}
							src={image}
							height={180}
							width={180}
							style={{
								borderRadius: 5,
								objectFit: 'contain',
								margin: 'auto',
							}}
						/>
					</Stack>
				</TableCell>
				<TableCell>
					<Typography
						variant="subtitle2"
						noWrap>
						{name}
					</Typography>
				</TableCell>
				<TableCell>{model}</TableCell>

				<TableCell>${price}</TableCell>

				<TableCell>{category}</TableCell>

				<TableCell>{stock}</TableCell>

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
				<MenuItem onClick={handleEdit}>
					<Iconify
						icon="eva:edit-fill"
						sx={{ mr: 2 }}
					/>
					Edit
				</MenuItem>

				<MenuItem
					onClick={handleDelete}
					sx={{ color: 'error.main' }}>
					<Iconify
						icon="eva:trash-2-outline"
						sx={{ mr: 2 }}
					/>
					Delete
				</MenuItem>
			</Popover>
		</>
	)
}

ProductTableRow.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string.isRequired,
	model: PropTypes.string.isRequired,
	price: PropTypes.number.isRequired,
	category: PropTypes.string.isRequired,
	stock: PropTypes.number.isRequired,
	image: PropTypes.string.isRequired,
	images: PropTypes.arrayOf(PropTypes.string),
	selected: PropTypes.bool,
	handleClick: PropTypes.func,
	handleEdit: PropTypes.func,
	handleDelete: PropTypes.func,
	handleInfoPopup: PropTypes.func,
}
