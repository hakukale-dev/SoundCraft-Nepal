import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useTheme } from '@mui/material/styles'

import { LoadingButton } from '@mui/lab'
import { MusicNote } from '@mui/icons-material'
import {
	Box,
	Grid,
	Stack,
	Container,
	TextField,
	Typography,
} from '@mui/material'

import axios from '../../utils/axios'

export default function ContactView() {
	const theme = useTheme()
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm()

	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = async (data) => {
		setIsLoading(true)
		try {
			await axios.post('/api/reach-us', { data })
			toast.success('Message Sent Successfully')
			reset()
		} catch (err) {
			toast.error('Failed to Send Message')
			console.error(err)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Box
			sx={{
				minHeight: 'calc(100vh - 100px)',
				pt: 8,
				pb: 6,
			}}>
			<Container maxWidth="lg">
				<Grid
					container
					spacing={5}>
					<Grid
						item
						xs={12}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 2,
								mb: 3,
							}}>
							<MusicNote
								sx={{
									color: theme.palette.primary.main,
									fontSize: 40,
								}}
							/>
							<Typography
								variant="h3"
								sx={{
									fontFamily: theme.typography.fontFamily,
									color: theme.palette.primary.main,
								}}>
								Contact Us
							</Typography>
						</Box>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}>
						<Typography
							variant="body1"
							paragraph
							sx={{
								color: theme.palette.text.primary,
								fontSize: '1.1rem',
								lineHeight: 1.8,
								mb: 4,
							}}>
							Feel free to reach out using the form below.
							We&apos;ll get back to you as soon as possible.
						</Typography>

						<form onSubmit={handleSubmit(onSubmit)}>
							<Stack spacing={3}>
								<TextField
									fullWidth
									size="small"
									label="Name"
									{...register('name', {
										required: 'Name is required',
									})}
									error={!!errors.name}
									helperText={errors.name?.message}
									sx={{
										'& .MuiOutlinedInput-root': {
											'&:hover fieldset': {
												borderColor:
													theme.palette.primary.main,
											},
										},
									}}
								/>
								<TextField
									fullWidth
									size="small"
									label="Email"
									{...register('email', {
										required: 'Email is required',
										pattern: {
											value: /^\S+@\S+$/i,
											message: 'Invalid email format',
										},
									})}
									error={!!errors.email}
									helperText={errors.email?.message}
									sx={{
										'& .MuiOutlinedInput-root': {
											'&:hover fieldset': {
												borderColor:
													theme.palette.primary.main,
											},
										},
									}}
								/>
								<TextField
									fullWidth
									multiline
									rows={4}
									label="Message"
									{...register('message', {
										required: 'Message is required',
									})}
									error={!!errors.message}
									helperText={errors.message?.message}
									sx={{
										'& .MuiOutlinedInput-root': {
											'&:hover fieldset': {
												borderColor:
													theme.palette.primary.main,
											},
										},
									}}
								/>
								<LoadingButton
									fullWidth
									loading={isLoading}
									type="submit"
									variant="contained"
									sx={{
										bgcolor: theme.palette.primary.main,
										'&:hover': {
											bgcolor: theme.palette.primary.dark,
										},
									}}>
									Send Message
								</LoadingButton>
							</Stack>
						</form>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}>
						<Box
							sx={{
								p: 4,
								bgcolor: theme.palette.background.paper,
								borderRadius: 2,
								boxShadow: theme.shadows[4],
							}}>
							<Typography
								variant="h5"
								sx={{
									fontFamily: theme.typography.fontFamily,
									color: theme.palette.primary.main,
									mb: 3,
								}}>
								Other Ways to Reach Us
							</Typography>
							<Stack spacing={2}>
								<Typography
									variant="body1"
									sx={{ color: theme.palette.text.primary }}>
									Email: soundcraftnepal@info.com
								</Typography>
								<Typography
									variant="body1"
									sx={{ color: theme.palette.text.primary }}>
									Phone: +977 9861343816
								</Typography>
								<Typography
									variant="body1"
									sx={{ color: theme.palette.text.primary }}>
									Address: Kathmandu, Nepal
								</Typography>
							</Stack>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	)
}
