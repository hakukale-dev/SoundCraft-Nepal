import { useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useMediaQuery } from '@mui/material'
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
				<TableCell align="center">
					<Typography variant={isMobile ? 'body2' : 'subtitle2'}>
						{name}
					</Typography>
				</TableCell>
				<TableCell>
					<Typography variant={isMobile ? 'body2' : 'subtitle2'}>
						{email}
					</Typography>
				</TableCell>
				<TableCell>
					<Typography
						noWrap
						variant={isMobile ? 'body2' : 'subtitle2'}>
						{isMobile
							? `${message.substring(0, 20)}...`
							: `${message.substring(0, 50)}...`}
					</Typography>
				</TableCell>
				<TableCell>
					<Typography variant={isMobile ? 'body2' : 'subtitle2'}>
						{new Date(createdAt).toLocaleDateString()}
					</Typography>
				</TableCell>
				<TableCell align="right">
					<IconButton
						size={isMobile ? 'small' : 'medium'}
						onClick={(e) => handleInfoPopup(e, id)}>
						<Iconify icon="eva:eye-outline" />
					</IconButton>
					<IconButton
						size={isMobile ? 'small' : 'medium'}
						color="error"
						onClick={(e) => handleDelete(e, id)}>
						<Iconify icon="eva:trash-2-outline" />
					</IconButton>
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
