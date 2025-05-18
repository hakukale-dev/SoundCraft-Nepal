import { useState, useEffect } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Grid,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

const QueryInfoPopup = ({ query, open, onClose, onDelete }) => {
	const theme = useTheme()

	if (!query) return null

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth>
			<DialogTitle>Query Details</DialogTitle>
			<DialogContent dividers>
				<Grid
					container
					spacing={3}>
					<Grid
						item
						xs={12}>
						<Typography
							variant="h6"
							gutterBottom>
							From: {query.name}
						</Typography>
						<Typography
							variant="subtitle1"
							gutterBottom>
							Email: {query.email}
						</Typography>
						<Typography
							variant="body1"
							gutterBottom>
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
					color="error">
					Delete
				</Button>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	)
}

export default QueryInfoPopup
