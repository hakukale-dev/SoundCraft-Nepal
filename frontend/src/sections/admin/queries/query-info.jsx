import { useState, useEffect } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Grid,
	useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

const QueryInfoPopup = ({ query, open, onClose, onDelete }) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	if (!query) return null

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth={isMobile ? 'xs' : 'md'}
			fullWidth
			fullScreen={isMobile}>
			<DialogTitle>Query Details</DialogTitle>
			<DialogContent dividers>
				<Grid
					container
					spacing={isMobile ? 1 : 3}>
					<Grid
						item
						xs={12}>
						<Typography
							variant={isMobile ? 'subtitle1' : 'h6'}
							gutterBottom>
							From: {query.name}
						</Typography>
						<Typography
							variant={isMobile ? 'body2' : 'subtitle1'}
							gutterBottom>
							Email: {query.email}
						</Typography>
						<Typography
							variant={isMobile ? 'body2' : 'body1'}
							gutterBottom
							style={{ wordBreak: 'break-word' }}>
							Message: {query.message}
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary">
							Submitted:{' '}
							{new Date(query.createdAt).toLocaleString()}
						</Typography>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={onDelete}
					color="error"
					size={isMobile ? 'small' : 'medium'}>
					Delete
				</Button>
				<Button
					onClick={onClose}
					size={isMobile ? 'small' : 'medium'}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default QueryInfoPopup
