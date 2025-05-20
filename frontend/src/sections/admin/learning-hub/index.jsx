import { toast } from 'react-toastify'
import { useState, useEffect, useCallback } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Pagination from '@mui/material/Pagination'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import axios from 'src/utils/axios'
import Iconify from 'src/components/iconify'
import { SimpleDialogForm } from './article-form'
import LearningHubInfoPopup from './article-info'
import ArticleCard from './article-card'
import { applyFilter, getComparator } from '../../../utils/utils'
import { TextField } from '@mui/material'

// ----------------------------------------------------------------------
export default function AdminLearningHubView() {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	const [page, setPage] = useState(0)
	const [order, setOrder] = useState('asc')
	const [selected, setSelected] = useState([])
	const [orderBy, setOrderBy] = useState('title')
	const [filterName, setFilterName] = useState('')
	const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 3 : 6)

	const [lessons, setLessons] = useState([])
	const [editingLesson, setEditingLesson] = useState({})
	const [infoLesson, setInfoLesson] = useState(null)

	const [isAdd, setisAdd] = useState(true)
	const [open, setOpen] = useState(false)
	const [infoOpen, setInfoOpen] = useState(false)

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setEditingLesson({})
		setOpen(false)
		setisAdd(true)
	}

	const handleInfoOpen = (lesson) => {
		setInfoLesson(lesson)
		setInfoOpen(true)
	}

	const handleInfoClose = () => {
		setInfoLesson(null)
		setInfoOpen(false)
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage - 1)
	}

	const handleFilterByName = (event) => {
		setPage(0)
		setFilterName(event.target.value)
	}

	const handleSubmit = async (data) => {
		try {
			const formData = new FormData()

			// Append regular fields
			formData.append('title', data.title)
			formData.append('category', data.category)
			formData.append('description', data.description)
			formData.append('content', data.content)
			formData.append('difficultyLevel', data.difficultyLevel)
			formData.append('videoUrl', data.videoUrl)

			// Handle file uploads
			if (data.thumbnail?.length > 0) {
				formData.append('thumbnail', data.thumbnail[0])
			}
			if (data.videoFile?.length > 0) {
				formData.append('videoFile', data.videoFile[0])
			}

			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
			const endpoint = isAdd
				? '/api/lessons'
				: `/api/lessons/${editingLesson._id}`

			const method = isAdd ? 'post' : 'put'

			await axios[method](endpoint, formData, config)
			toast.success(isAdd ? 'Lesson Added' : 'Edit Success')
			handleClose()
			fetchData()
		} catch (err) {
			toast.error(
				isAdd ? 'Failed to add lesson' : 'Failed to edit lesson'
			)
			console.error('Error:', err.response?.data || err.message)
		}
	}

	const handleEdit = (event, id) => {
		const lessonData = lessons.find((data) => data._id === id)
		setEditingLesson(lessonData)
		setOpen(true)
		setisAdd(false)
	}

	const handleDelete = (event, id) => {
		axios
			.delete(`/api/lessons/${id}/`)
			.then(() => {
				toast.success('Deleted Successfully')
				fetchData()
			})
			.catch((err) => {
				toast.error('Failed to delete lesson')
				console.log(err)
			})
	}

	const handleInfoPopup = (event, id) => {
		const lessonData = lessons.find((data) => data._id === id)
		handleInfoOpen(lessonData)
	}

	const dataFiltered = applyFilter({
		inputData: lessons,
		comparator: getComparator(order, orderBy),
		filterKey: 'title',
		filterValue: filterName,
	})

	const notFound = !dataFiltered.length && !!filterName

	const fetchData = useCallback(
		() =>
			axios
				.get('/api/lessons')
				.then((res) => {
					setLessons(res.data)
				})
				.catch((err) => {
					toast.error('Failed to fetch lessons')
					console.log(err)
				}),
		[]
	)

	useEffect(() => {
		fetchData()
	}, [fetchData])

	return (
		<Container maxWidth={isMobile ? false : 'lg'}>
			{open && (
				<SimpleDialogForm
					isAdd={isAdd}
					onClose={handleClose}
					onSubmit={handleSubmit}
					formData={editingLesson}
				/>
			)}

			{infoLesson && (
				<LearningHubInfoPopup
					lesson={infoLesson}
					open={infoOpen}
					onClose={handleInfoClose}
					onEdit={(e) => handleEdit(e, infoLesson._id)}
					onDelete={(e) => handleDelete(e, infoLesson._id)}
				/>
			)}

			<Stack
				direction={isMobile ? 'column' : 'row'}
				alignItems="center"
				justifyContent="space-between"
				mb={5}
				spacing={isMobile ? 2 : 0}>
				<Typography variant={isMobile ? 'h5' : 'h4'}>
					Learning Hub
				</Typography>

				<Button
					variant="contained"
					color="inherit"
					size={isMobile ? 'small' : 'medium'}
					startIcon={<Iconify icon="eva:plus-fill" />}
					onClick={handleOpen}>
					New Lesson
				</Button>
			</Stack>

			<Card sx={{ p: isMobile ? 2 : 3 }}>
				<Stack spacing={3}>
					<Stack
						direction={isMobile ? 'column' : 'row'}
						justifyContent="space-between"
						alignItems={isMobile ? 'flex-start' : 'center'}
						spacing={isMobile ? 2 : 0}>
						<Typography variant={isMobile ? 'subtitle1' : 'h6'}>
							Lessons
						</Typography>
						<TextField
							fullWidth={isMobile}
							size="small"
							placeholder="Search lessons..."
							value={filterName}
							onChange={handleFilterByName}
							sx={{
								minWidth: isMobile ? '100%' : 300,
							}}
						/>
					</Stack>

					{notFound ? (
						<Typography
							variant="body1"
							align="center">
							No lessons found
						</Typography>
					) : (
						<Grid
							container
							spacing={isMobile ? 2 : 3}>
							{dataFiltered
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map((lesson) => (
									<Grid
										item
										key={lesson._id}
										xs={12}
										sm={6}
										md={4}>
										<ArticleCard
											title={lesson.title}
											description={lesson.description}
											difficultyLevel={
												lesson.difficultyLevel
											}
											category={lesson.category}
											thumbnail={lesson.thumbnailUrl}
											handleEdit={() =>
												handleEdit(null, lesson._id)
											}
											handleDelete={() =>
												handleDelete(null, lesson._id)
											}
											handleInfoPopup={() =>
												handleInfoPopup(
													null,
													lesson._id
												)
											}
											isMobile={isMobile}
										/>
									</Grid>
								))}
						</Grid>
					)}

					<Stack
						direction="row"
						justifyContent="center"
						mt={3}>
						<Pagination
							count={Math.ceil(dataFiltered.length / rowsPerPage)}
							page={page + 1}
							onChange={handleChangePage}
							color="primary"
							size={isMobile ? 'small' : 'medium'}
						/>
					</Stack>
				</Stack>
			</Card>
		</Container>
	)
}
