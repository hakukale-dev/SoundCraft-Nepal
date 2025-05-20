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
	useMediaQuery,
} from '@mui/material'

import axios from '../../utils/axios'

export default function ContactView() {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
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
				pt: isMobile ? 4 : 8,
				pb: isMobile ? 3 : 6,
			}}>
			<Container maxWidth="lg">
				<Grid
					container
					spacing={isMobile ? 2 : 5}>
					<Grid
						item
						xs={12}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 2,
								mb: isMobile ? 2 : 3,
							}}>
							<MusicNote
								sx={{
									color: theme.palette.primary.main,
									fontSize: isMobile ? 30 : 40,
								}}
							/>
							<Typography
								variant={isMobile ? 'h4' : 'h3'}
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
								fontSize: isMobile ? '1rem' : '1.1rem',
								lineHeight: 1.8,
								mb: isMobile ? 2 : 4,
							}}>
							Feel free to reach out using the form below.
							We&apos;ll get back to you as soon as possible.
						</Typography>

						<form onSubmit={handleSubmit(onSubmit)}>
							<Stack spacing={isMobile ? 2 : 3}>
								<TextField
									fullWidth
									size={isMobile ? 'small' : 'medium'}
									label="Name"
									{...register('name', {
										required: 'Name is required',
									})}
									error={!!errors.name}
									helperText={errors.name?.message}
								/>
								<TextField
									fullWidth
									size={isMobile ? 'small' : 'medium'}
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
								/>
								<TextField
									fullWidth
									multiline
									rows={isMobile ? 3 : 4}
									label="Message"
									{...register('message', {
										required: 'Message is required',
									})}
									error={!!errors.message}
									helperText={errors.message?.message}
								/>
								<LoadingButton
									fullWidth
									loading={isLoading}
									type="submit"
									variant="contained"
									size={isMobile ? 'medium' : 'large'}
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
								p: isMobile ? 2 : 4,
								bgcolor: theme.palette.background.paper,
								borderRadius: 2,
								boxShadow: theme.shadows[4],
								mt: isMobile ? 2 : 0,
							}}>
							<Typography
								variant={isMobile ? 'h6' : 'h5'}
								sx={{
									fontFamily: theme.typography.fontFamily,
									color: theme.palette.primary.main,
									mb: isMobile ? 2 : 3,
								}}>
								Other Ways to Reach Us
							</Typography>
							<Stack spacing={isMobile ? 1 : 2}>
								<Typography
									variant={isMobile ? 'body2' : 'body1'}
									sx={{ color: theme.palette.text.primary }}>
									Email: soundcraftnepal@info.com
								</Typography>
								<Typography
									variant={isMobile ? 'body2' : 'body1'}
									sx={{ color: theme.palette.text.primary }}>
									Phone: +977 9861343816
								</Typography>
								<Typography
									variant={isMobile ? 'body2' : 'body1'}
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
