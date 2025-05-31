import { useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme, useMediaQuery } from '@mui/material'

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
				selected={selected}
				onClick={handleClick}>
				<TableCell>
					<Typography variant={isMobile ? 'caption' : 'subtitle2'}>
						{user || 'Guest'}
					</Typography>
				</TableCell>

				{!isMobile && (
					<TableCell align="center">
						<Typography variant="body2">
							{new Date(createdAt).toLocaleDateString()}
						</Typography>
					</TableCell>
				)}

				<TableCell>
					<Typography variant={isMobile ? 'caption' : 'body2'}>
						Rs. {total.toFixed(2)}
					</Typography>
				</TableCell>

				<TableCell>
					<Chip
						label={status}
						size={isMobile ? 'small' : 'medium'}
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
						sx={{
							mr: 2,
							width: isMobile ? 16 : 20,
							height: isMobile ? 16 : 20,
						}}
					/>
					<Typography variant={isMobile ? 'caption' : 'body2'}>
						Info
					</Typography>
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
