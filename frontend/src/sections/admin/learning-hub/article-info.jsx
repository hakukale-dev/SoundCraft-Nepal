import { useState, useEffect } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Grid,
	Avatar,
	Chip,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

const LearningHubInfoPopup = ({ lesson, open, onClose, onEdit, onDelete }) => {
	const theme = useTheme()

	const isYoutubeUrl = (url) => {
		return url.includes('youtube.com') || url.includes('youtu.be')
	}

	const getYoutubeEmbedUrl = (url) => {
		let videoId = ''
		if (url.includes('v=')) {
			videoId = url.split('v=')[1].split('&')[0]
		} else if (url.includes('youtu.be')) {
			videoId = url.split('youtu.be/')[1]
		}
		return `https://www.youtube.com/embed/${videoId}`
	}

	if (!lesson) return null

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth>
			<DialogTitle>{lesson.title}</DialogTitle>
			<DialogContent dividers>
				<Grid
					container
					spacing={3}>
					{lesson.thumbnailUrl && (
						<Grid
							item
							xs={12}
							md={4}>
							<Avatar
								src={lesson.thumbnailUrl}
								variant="rounded"
								sx={{
									width: '100%',
									height: 300,
									bgcolor: theme.palette.grey[200],
								}}
							/>
						</Grid>
					)}
					<Grid
						item
						xs={12}
						md={lesson.thumbnailUrl ? 8 : 12}>
						<Typography
							variant="h6"
							gutterBottom>
							Category: {lesson.category}
						</Typography>
						<Typography
							variant="body1"
							gutterBottom>
							{lesson.description}
						</Typography>
						<Grid
							container
							spacing={2}
							sx={{ mt: 2 }}>
							<Grid
								item
								xs={6}>
								<Typography variant="subtitle1">
									Difficulty: {lesson.difficultyLevel}
								</Typography>
							</Grid>
							<Grid
								item
								xs={6}>
								<Typography variant="subtitle1">
									Created:{' '}
									{new Date(
										lesson.createdAt
									).toLocaleDateString()}
								</Typography>
							</Grid>
						</Grid>
						{lesson.videoUrl && (
							<Grid
								container
								spacing={2}
								sx={{ mt: 2 }}>
								<Grid
									item
									xs={12}>
									{isYoutubeUrl(lesson.videoUrl) ? (
										<iframe
											width="100%"
											height="400"
											src={getYoutubeEmbedUrl(
												lesson.videoUrl
											)}
											title="YouTube video player"
											frameBorder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
										/>
									) : (
										<video
											controls
											style={{
												width: '100%',
												maxHeight: '400px',
											}}
											src={lesson.videoUrl}
										/>
									)}
								</Grid>
							</Grid>
						)}
						{lesson.resources && lesson.resources.length > 0 && (
							<Grid
								container
								spacing={2}
								sx={{ mt: 2 }}>
								<Grid
									item
									xs={12}>
									<Typography variant="h6">
										Resources:
									</Typography>
									{lesson.resources.map((resource, index) => (
										<Chip
											key={index}
											label={`${resource.type}: ${resource.description}`}
											sx={{ mr: 1, mb: 1 }}
											onClick={() =>
												window.open(
													resource.url,
													'_blank'
												)
											}
											clickable
										/>
									))}
								</Grid>
							</Grid>
						)}
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={onDelete}
					color="error">
					Delete
				</Button>
				<Button
					onClick={onEdit}
					color="primary">
					Edit
				</Button>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	)
}

export default LearningHubInfoPopup
