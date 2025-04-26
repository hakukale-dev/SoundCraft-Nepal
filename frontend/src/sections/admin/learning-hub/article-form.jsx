import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { useTheme } from '@mui/material/styles'
import {
	Dialog,
	Button,
	TextField,
	DialogTitle,
	DialogActions,
	DialogContent,
	Grid,
	MenuItem,
	Avatar,
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	CircularProgress,
} from '@mui/material'
import { useState } from 'react'

const LESSON_CATEGORIES = [
	'Music Theory',
	'Instrument Techniques',
	'Composition',
	'Music Production',
	'History of Music',
	'Performance Tips',
]

const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

export const SimpleDialogForm = ({
	isAdd,
	formData = {},
	onClose,
	onSubmit,
}) => {
	const theme = useTheme()
	const [videoSourceType, setVideoSourceType] = useState('url')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm({
		defaultValues: {
			title: formData.title || '',
			category: formData.category || '',
			description: formData.description || '',
			content: formData.content || '',
			difficultyLevel: formData.difficultyLevel || 'Beginner',
			videoUrl: formData.videoUrl || '',
			videoFile: null,
			thumbnail: formData.thumbnail || '',
		},
	})

	const thumbnailPreview = watch('thumbnail') || formData.thumbnail
	const videoFile = watch('videoFile')
	const videoUrl = watch('videoUrl')

	const validationRules = {
		title: { required: 'Lesson title is required' },
		category: { required: 'Lesson category is required' },
		description: { required: 'Lesson description is required' },
		content: { required: 'Lesson content is required' },
		difficultyLevel: { required: 'Difficulty level is required' },
		videoUrl: {
			required:
				videoSourceType === 'url' ? 'Video URL is required' : false,
			pattern: {
				value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
				message: 'Please enter a valid YouTube URL',
			},
		},
		videoFile: {
			validate: {
				required: (files) => {
					if (videoSourceType === 'file' && !files?.length) {
						return 'Video file is required'
					}
					return true
				},
				acceptedFormats: (files) => {
					if (!files?.length) return true
					for (const file of files) {
						const acceptedTypes = [
							'video/mp4',
							'video/webm',
							'video/ogg',
						]
						if (!acceptedTypes.includes(file.type)) {
							return 'Only MP4, WebM and OGG files are allowed'
						}
						if (file.size > 100 * 1024 * 1024) {
							return 'File size must be less than 100MB'
						}
					}
					return true
				},
			},
		},
		thumbnail: {
			validate: {
				acceptedFormats: (files) => {
					if (!files?.length) return true
					for (const file of files) {
						const acceptedTypes = [
							'image/jpeg',
							'image/png',
							'image/gif',
							'image/jpg',
						]
						if (!acceptedTypes.includes(file.type)) {
							return 'Only JPG, JPEG, PNG and GIF files are allowed'
						}
						if (file.size > 5 * 1024 * 1024) {
							return 'File size must be less than 5MB'
						}
					}
					return true
				},
			},
		},
	}

	const getThumbnailSrc = () => {
		if (!thumbnailPreview) return ''
		if (typeof thumbnailPreview === 'string') return thumbnailPreview
		if (thumbnailPreview instanceof FileList) {
			return URL.createObjectURL(thumbnailPreview?.[0])
		}
		return ''
	}

	const handleFormSubmit = async (data) => {
		setIsSubmitting(true)
		try {
			await onSubmit(data)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog
			open
			onClose={onClose}
			maxWidth="md"
			fullWidth>
			<DialogTitle>
				{isAdd ? 'Add New Lesson' : 'Edit Lesson'}
			</DialogTitle>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<DialogContent dividers>
					<Grid
						container
						spacing={3}>
						<Grid
							item
							xs={12}
							md={4}>
							<Avatar
								src={getThumbnailSrc()}
								variant="rounded"
								sx={{
									width: '100%',
									height: 300,
									bgcolor: theme.palette.grey[200],
									mb: 2,
								}}
							/>
							<input
								type="file"
								id="thumbnail"
								accept="image/*"
								style={{ display: 'none' }}
								{...register(
									'thumbnail',
									validationRules.thumbnail
								)}
							/>
							<label htmlFor="thumbnail">
								<Button
									component="span"
									variant="contained"
									fullWidth>
									Upload Thumbnail
								</Button>
							</label>
							{errors.thumbnail && (
								<FormHelperText error>
									{errors.thumbnail.message}
								</FormHelperText>
							)}
						</Grid>
						<Grid
							item
							xs={12}
							md={8}>
							<Grid
								container
								spacing={2}>
								<Grid
									item
									xs={12}>
									<TextField
										fullWidth
										label="Lesson Title"
										{...register(
											'title',
											validationRules.title
										)}
										error={!!errors.title}
										helperText={errors.title?.message}
									/>
								</Grid>
								<Grid
									item
									xs={12}>
									<TextField
										fullWidth
										label="Description"
										multiline
										rows={4}
										{...register(
											'description',
											validationRules.description
										)}
										error={!!errors.description}
										helperText={errors.description?.message}
									/>
								</Grid>
								<Grid
									item
									xs={12}>
									<TextField
										fullWidth
										label="Content"
										multiline
										rows={6}
										{...register(
											'content',
											validationRules.content
										)}
										error={!!errors.content}
										helperText={errors.content?.message}
									/>
								</Grid>
								<Grid
									item
									xs={12}
									sm={6}>
									<TextField
										fullWidth
										select
										label="Category"
										{...register(
											'category',
											validationRules.category
										)}
										error={!!errors.category}
										helperText={errors.category?.message}>
										{LESSON_CATEGORIES.map((category) => (
											<MenuItem
												key={category}
												value={category}>
												{category}
											</MenuItem>
										))}
									</TextField>
								</Grid>
								<Grid
									item
									xs={12}
									sm={6}>
									<TextField
										fullWidth
										select
										label="Difficulty Level"
										{...register(
											'difficultyLevel',
											validationRules.difficultyLevel
										)}
										error={!!errors.difficultyLevel}
										helperText={
											errors.difficultyLevel?.message
										}>
										{DIFFICULTY_LEVELS.map((level) => (
											<MenuItem
												key={level}
												value={level}>
												{level}
											</MenuItem>
										))}
									</TextField>
								</Grid>
								<Grid
									item
									xs={12}>
									<FormControl component="fieldset">
										<FormLabel component="legend">
											Video Source
										</FormLabel>
										<RadioGroup
											row
											value={videoSourceType}
											onChange={(e) =>
												setVideoSourceType(
													e.target.value
												)
											}>
											<FormControlLabel
												value="url"
												control={<Radio />}
												label="YouTube URL"
											/>
											<FormControlLabel
												value="file"
												control={<Radio />}
												label="Upload Video"
											/>
										</RadioGroup>
									</FormControl>
								</Grid>
								{videoSourceType === 'url' ? (
									<Grid
										item
										xs={12}>
										<TextField
											fullWidth
											label="YouTube Video URL"
											{...register(
												'videoUrl',
												validationRules.videoUrl
											)}
											error={!!errors.videoUrl}
											helperText={
												errors.videoUrl?.message
											}
										/>
									</Grid>
								) : (
									<Grid
										item
										xs={12}>
										<input
											type="file"
											id="videoFile"
											accept="video/*"
											style={{ display: 'none' }}
											{...register('videoFile')}
										/>
										<label htmlFor="videoFile">
											<Button
												variant="contained"
												component="span">
												Upload Video
											</Button>
										</label>
									</Grid>
								)}
							</Grid>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Cancel</Button>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting}>
						{isSubmitting ? (
							<CircularProgress
								size={24}
								color="inherit"
							/>
						) : isAdd ? (
							'Add Lesson'
						) : (
							'Save Changes'
						)}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	)
}

SimpleDialogForm.propTypes = {
	isAdd: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	formData: PropTypes.shape({
		title: PropTypes.string,
		category: PropTypes.string,
		description: PropTypes.string,
		content: PropTypes.string,
		difficultyLevel: PropTypes.string,
		videoUrl: PropTypes.string,
		thumbnail: PropTypes.string,
		videoFile: PropTypes.object,
	}),
}
