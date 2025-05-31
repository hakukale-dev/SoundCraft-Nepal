import { useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Popover from '@mui/material/Popover'
import TableRow from '@mui/material/TableRow'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
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
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
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
				<TableCell
					component="th"
					scope="row"
					sx={{
						padding: isMobile ? 1 : 2,
						textAlign: 'center',
					}}>
					<Stack
						direction="row"
						alignItems="center"
						spacing={2}>
						<img
							alt={name}
							src={image}
							height={isMobile ? 80 : 180}
							width={isMobile ? 80 : 180}
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
						variant={isMobile ? 'body2' : 'subtitle2'}
						noWrap>
						{name}
					</Typography>
				</TableCell>
				<TableCell sx={{ display: isMobile ? 'body2' : 'subtitle2' }}>
					{model}
				</TableCell>

				<TableCell>Rs. {price}</TableCell>

				<TableCell sx={{ display: isMobile ? 'body2' : 'subtitle2' }}>
					{category}
				</TableCell>

				<TableCell>{stock}</TableCell>

				<TableCell align="right">
					<IconButton
						onClick={handleOpenMenu}
						size={isMobile ? 'small' : 'medium'}>
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
					sx: { width: isMobile ? 120 : 140 },
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
