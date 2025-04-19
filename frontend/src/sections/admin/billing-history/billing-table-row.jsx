import { useState } from 'react'
import PropTypes from 'prop-types'

import Stack from '@mui/material/Stack'
import Popover from '@mui/material/Popover'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import Iconify from 'src/components/iconify'

// ----------------------------------------------------------------------

export default function BillingTableRow({
	id,
	selected,
	payment_reference_id,
	user_id,
	payment_method,
	amount,
	status,
	createdAt,
	handleClick,
}) {
	const [open, setOpen] = useState(null)

	const handleOpenMenu = (event) => {
		setOpen(event.currentTarget)
	}

	const handleCloseMenu = () => {
		setOpen(null)
	}

	const handleDownloadInvoice = () => {
		// Implement invoice download logic
		console.log('Downloading invoice for:', payment_reference_id)
		handleCloseMenu()
	}

	return (
		<>
			<TableRow
				hover
				tabIndex={-1}
				role="checkbox"
				selected={selected}>
				<TableCell padding="checkbox">
					<Checkbox
						disableRipple
						checked={selected}
						onChange={handleClick}
					/>
				</TableCell>

				<TableCell>
					<Typography
						variant="body2"
						noWrap>
						{payment_reference_id}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography
						variant="body2"
						noWrap>
						{user_id}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography
						variant="body2"
						noWrap>
						{payment_method}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography
						variant="body2"
						noWrap>
						${amount.toFixed(2)}
					</Typography>
				</TableCell>

				<TableCell>
					<Tooltip title={status}>
						<Iconify
							icon={
								status === 'completed'
									? 'eva:checkmark-circle-2-outline'
									: 'eva:alert-circle-outline'
							}
							sx={{
								color:
									status === 'completed'
										? 'success.main'
										: 'warning.main',
								width: 24,
								height: 24,
							}}
						/>
					</Tooltip>
				</TableCell>

				<TableCell>
					<Typography
						variant="body2"
						noWrap>
						{createdAt}
					</Typography>
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
				<MenuItem onClick={handleDownloadInvoice}>
					<Iconify
						icon="eva:download-outline"
						sx={{ mr: 2 }}
					/>
					Download
				</MenuItem>
			</Popover>
		</>
	)
}

BillingTableRow.propTypes = {
	id: PropTypes.any,
	selected: PropTypes.any,
	payment_reference_id: PropTypes.string,
	user_id: PropTypes.string,
	payment_method: PropTypes.string,
	amount: PropTypes.number,
	status: PropTypes.string,
	createdAt: PropTypes.string,
	handleClick: PropTypes.func,
}
