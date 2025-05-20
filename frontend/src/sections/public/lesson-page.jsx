import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {
	Box,
	Container,
	Typography,
	Grid,
	Card,
	CardContent,
	CardMedia,
	Button,
	Chip,
	Avatar,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	LinearProgress,
	Skeleton,
	useTheme,
	useMediaQuery,
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import {
	PlayCircleOutline,
	School,
	AccessTime,
	Download,
	ErrorOutline,
} from '@mui/icons-material'
import axios from 'src/utils/axios'

const LessonPageView = () => {
	const { id } = useParams()
	const [lesson, setLesson] = useState(null)
	const [loading, setLoading] = useState(true)
	const [videoDuration, setVideoDuration] = useState(0)
	const [currentTime, setCurrentTime] = useState(0)
	const videoRef = useRef(null)
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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

	useEffect(() => {
		const fetchLesson = async () => {
			try {
				const response = await axios.get(`/api/lessons/${id}`)
				setLesson(response.data)
				setLoading(false)
			} catch (error) {
				console.error('Error fetching lesson:', error)
				setLoading(false)
			}
		}

		fetchLesson()
	}, [id])

	const handleLoadedMetadata = () => {
		if (videoRef.current) {
			setVideoDuration(videoRef.current.duration)
		}
	}

	const handleTimeUpdate = () => {
		if (videoRef.current) {
			setCurrentTime(videoRef.current.currentTime)
		}
	}

	const formatTime = (timeInSeconds) => {
		const minutes = Math.floor(timeInSeconds / 60)
		const seconds = Math.floor(timeInSeconds % 60)
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
	}

	if (loading) {
		return (
			<Box sx={{ py: isMobile ? 4 : 8 }}>
				<Container maxWidth="xl">
					<Grid
						container
						spacing={isMobile ? 2 : 4}>
						<Grid
							item
							xs={12}
							md={8}>
							<Skeleton
								variant="rectangular"
								height={isMobile ? 200 : 500}
								sx={{ borderRadius: 2 }}
							/>
							<Box sx={{ mt: 2 }}>
								<Skeleton
									variant="text"
									height={isMobile ? 40 : 60}
								/>
								<Skeleton
									variant="text"
									width={isMobile ? '60%' : '40%'}
								/>
								<Skeleton
									variant="text"
									height={isMobile ? 60 : 100}
								/>
							</Box>
						</Grid>
						{!isMobile && (
							<Grid
								item
								xs={12}
								md={4}>
								<Skeleton
									variant="rectangular"
									height={300}
									sx={{ borderRadius: 2 }}
								/>
							</Grid>
						)}
					</Grid>
				</Container>
			</Box>
		)
	}

	if (!lesson) {
		return (
			<Box
				sx={{
					py: isMobile ? 4 : 8,
					textAlign: 'center',
					minHeight: '60vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ type: 'spring', stiffness: 100 }}>
					<ErrorOutline
						sx={{
							fontSize: isMobile ? 60 : 80,
							color: 'error.main',
							mb: 2,
						}}
					/>
					<Typography
						variant={isMobile ? 'h5' : 'h4'}
						color="text.secondary">
						Lesson not found
					</Typography>
					<Typography
						variant={isMobile ? 'body2' : 'body1'}
						sx={{ mt: 1 }}>
						The requested lesson could not be loaded.
					</Typography>
				</motion.div>
			</Box>
		)
	}

	return (
		<Box sx={{ py: isMobile ? 3 : 8, bgcolor: 'background.default' }}>
			<Container maxWidth="xl">
				<Grid
					container
					spacing={isMobile ? 2 : 4}>
					<Grid
						item
						xs={12}
						md={8}>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}>
							<Card
								sx={{
									borderRadius: 2,
									boxShadow: theme.shadows[isMobile ? 1 : 4],
									overflow: 'hidden',
								}}>
								<Box
									sx={{
										position: 'relative',
										bgcolor: 'black',
									}}>
									{isYoutubeUrl(lesson.videoUrl) ? (
										<iframe
											width="100%"
											height={isMobile ? '250' : '500'}
											src={getYoutubeEmbedUrl(
												lesson.videoUrl
											)}
											title="YouTube video player"
											frameBorder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
										/>
									) : (
										<CardMedia
											component="video"
											controls
											src={lesson.videoUrl}
											alt={lesson.title}
											ref={videoRef}
											onLoadedMetadata={
												handleLoadedMetadata
											}
											onTimeUpdate={handleTimeUpdate}
											sx={{
												height: 'auto',
												aspectRatio: '16/9',
												'& .MuiCardMedia-media': {
													objectFit: 'cover',
												},
											}}
										/>
									)}
									<Chip
										label={lesson.category}
										color="primary"
										size="small"
										sx={{
											position: 'absolute',
											top: 8,
											left: 8,
											fontWeight: 600,
											backdropFilter: 'blur(4px)',
											bgcolor: 'rgba(0, 0, 0, 0.5)',
											color: 'white',
											fontSize: isMobile
												? '0.7rem'
												: '0.8125rem',
										}}
									/>
								</Box>
								<CardContent
									sx={{
										px: isMobile ? 2 : 4,
										py: isMobile ? 2 : 3,
									}}>
									<Typography
										variant={isMobile ? 'h5' : 'h4'}
										component="h1"
										gutterBottom
										sx={{
											fontWeight: 700,
											color: 'text.primary',
										}}>
										{lesson.title}
									</Typography>
									{!isYoutubeUrl(lesson.videoUrl) && (
										<LinearProgress
											variant="determinate"
											value={
												(currentTime / videoDuration) *
													100 || 0
											}
											sx={{
												height: 4,
												borderRadius: 2,
												mb: 2,
											}}
										/>
									)}
									<Typography
										variant={isMobile ? 'body2' : 'body1'}
										paragraph
										sx={{
											lineHeight: 1.6,
											color: 'text.secondary',
											mb: 2,
										}}>
										{lesson.description}
									</Typography>
									<Box
										sx={{
											display: 'flex',
											gap: 1,
											mt: 2,
											flexWrap: 'wrap',
										}}>
										{!isYoutubeUrl(lesson.videoUrl) && (
											<Chip
												icon={
													<AccessTime
														fontSize={
															isMobile
																? 'small'
																: 'medium'
														}
													/>
												}
												label={`${formatTime(
													currentTime
												)} / ${formatTime(
													videoDuration
												)}`}
												variant="outlined"
												size={
													isMobile
														? 'small'
														: 'medium'
												}
											/>
										)}
										<Chip
											icon={
												<School
													fontSize={
														isMobile
															? 'small'
															: 'medium'
													}
												/>
											}
											label={lesson.difficultyLevel}
											color="secondary"
											variant="outlined"
											size={isMobile ? 'small' : 'medium'}
										/>
									</Box>
								</CardContent>
							</Card>
						</motion.div>
					</Grid>

					<Grid
						item
						xs={12}
						md={4}>
						<AnimatePresence>
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.3 }}
								style={{
									position: isMobile ? 'static' : 'sticky',
									top: isMobile ? 0 : 100,
								}}>
								<Card
									sx={{
										borderRadius: 3,
										boxShadow: theme.shadows[3],
										mb: 3,
									}}>
									<CardContent sx={{ p: isMobile ? 2 : 3 }}>
										<List dense>
											{!isYoutubeUrl(lesson.videoUrl) && (
												<ListItem>
													<ListItemAvatar>
														<Avatar
															sx={{
																bgcolor:
																	'secondary.main',
																width: isMobile
																	? 28
																	: 36,
																height: isMobile
																	? 28
																	: 36,
															}}>
															<AccessTime
																fontSize={
																	isMobile
																		? 'small'
																		: 'medium'
																}
															/>
														</Avatar>
													</ListItemAvatar>
													<ListItemText
														primary="Total Duration"
														primaryTypographyProps={{
															variant: isMobile
																? 'body2'
																: 'body1',
														}}
														secondary={formatTime(
															videoDuration
														)}
														secondaryTypographyProps={{
															variant: isMobile
																? 'caption'
																: 'body2',
														}}
													/>
												</ListItem>
											)}
										</List>

										<motion.div
											whileHover={{
												scale: lesson.resourceUrl
													? 1.02
													: 1,
											}}>
											<Button
												fullWidth
												variant="contained"
												size={
													isMobile
														? 'medium'
														: 'large'
												}
												startIcon={
													<Download
														fontSize={
															isMobile
																? 'small'
																: 'medium'
														}
													/>
												}
												sx={{
													mt: 2,
													py: isMobile ? 1 : 1.5,
													borderRadius: 2,
													textTransform: 'none',
													fontSize: isMobile
														? '0.875rem'
														: '1rem',
													fontWeight: 600,
													opacity: lesson.resourceUrl
														? 1
														: 0.7,
												}}
												href={lesson.resourceUrl}
												target="_blank"
												disabled={!lesson.resourceUrl}>
												{lesson.resourceUrl
													? 'Download Resources'
													: 'No Resources Available'}
											</Button>
										</motion.div>
									</CardContent>
								</Card>

								<Card
									sx={{
										borderRadius: 3,
										boxShadow: theme.shadows[3],
									}}>
									<CardContent sx={{ p: isMobile ? 2 : 3 }}>
										<Typography
											variant={
												isMobile ? 'subtitle1' : 'h6'
											}
											gutterBottom
											sx={{ fontWeight: 600 }}>
											What You'll Learn
										</Typography>
										<List dense>
											{lesson.learningObjectives?.map(
												(obj, index) => (
													<ListItem
														key={index}
														sx={{
															alignItems: 'start',
															py: isMobile
																? 0.5
																: 1,
														}}>
														<ListItemAvatar
															sx={{
																minWidth:
																	isMobile
																		? 28
																		: 32,
																pt: 0.5,
															}}>
															<Avatar
																sx={{
																	width: isMobile
																		? 16
																		: 20,
																	height: isMobile
																		? 16
																		: 20,
																	bgcolor:
																		'success.main',
																}}>
																✓
															</Avatar>
														</ListItemAvatar>
														<ListItemText
															primary={obj}
															primaryTypographyProps={{
																variant:
																	isMobile
																		? 'body2'
																		: 'body1',
															}}
														/>
													</ListItem>
												)
											)}
										</List>
									</CardContent>
								</Card>
							</motion.div>
						</AnimatePresence>
					</Grid>
				</Grid>
			</Container>
		</Box>
	)
}

export default LessonPageView
