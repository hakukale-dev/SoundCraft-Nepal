import { useState } from 'react'
import PropTypes from 'prop-types'

import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
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

export default function UserTableRow({
	id,
	selected,
	username,
	avatarUrl,
	email,
	phone_number,
	is_disabled,
	handleClick,
	handleEdit,
	handleDisable,
	handleEnable,
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
				<TableCell padding="checkbox">
					<Checkbox
						disableRipple
						checked={selected}
						onChange={handleClick}
					/>
				</TableCell>

				<TableCell
					component="th"
					scope="row"
					padding="none">
					<Stack
						direction="row"
						alignItems="center"
						spacing={2}>
						<Avatar
							alt={username}
							src={avatarUrl}
						/>
						<Typography
							variant="subtitle2"
							noWrap>
							{username}
						</Typography>
					</Stack>
				</TableCell>

				<TableCell>{email}</TableCell>

				<TableCell>{phone_number}</TableCell>

				<TableCell>
					<Tooltip title={is_disabled ? 'Disabled' : 'Enabled'}>
						<Iconify
							icon={
								is_disabled
									? 'eva:slash-outline'
									: 'eva:checkmark-circle-2-outline'
							}
							sx={{
								color: is_disabled
									? 'error.main'
									: 'success.main',
								width: 24,
								height: 24,
							}}
						/>
					</Tooltip>
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
				<MenuItem onClick={handleEdit}>
					<Iconify
						icon="eva:edit-fill"
						sx={{ mr: 2 }}
					/>
					Edit
				</MenuItem>

				<MenuItem
					onClick={is_disabled ? handleEnable : handleDisable}
					sx={{ color: is_disabled ? 'success.main' : 'error.main' }}>
					<Iconify
						icon={
							is_disabled
								? 'eva:checkmark-circle-2-outline'
								: 'eva:slash-outline'
						}
						sx={{ mr: 2 }}
					/>
					{is_disabled ? 'Enable' : 'Disable'}
				</MenuItem>
			</Popover>
		</>
	)
}

UserTableRow.propTypes = {
	id: PropTypes.any,
	avatarUrl: PropTypes.any,
	email: PropTypes.any,
	handleClick: PropTypes.func,
	handleEdit: PropTypes.func || null,
	handleDisable: PropTypes.func.isRequired,
	handleEnable: PropTypes.func.isRequired,
	name: PropTypes.any,
	role: PropTypes.any,
	selected: PropTypes.any,
	is_disabled: PropTypes.bool.isRequired,
}
