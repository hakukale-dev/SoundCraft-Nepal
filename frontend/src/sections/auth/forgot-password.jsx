import { useState } from 'react'
import { toast } from 'react-toastify'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import { alpha, useTheme } from '@mui/material/styles'
import { MusicNote } from '@mui/icons-material'

import axios from 'src/utils/axios'
import { bgGradient } from 'src/theme/css'
import { useNavigate } from 'react-router-dom'
import Iconify from 'src/components/iconify'

export default function ForgotPasswordView() {
	const navigate = useNavigate()
	const theme = useTheme()

	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)

	const handleChange = (e) => {
		setEmail(e.target.value)
		setError(null)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!email) {
			toast.warning('Please enter your email')
			return
		}

		setIsLoading(true)
		try {
			await axios.post('api/auth/forgot-password', { email })
			toast.success('Password reset email sent! Check your inbox.')
			navigate('/login')
		} catch (error) {
			const errorMessage =
				error.response?.data?.error || 'Failed to send reset email'
			setError(errorMessage)
			toast.error(errorMessage)
		} finally {
			setIsLoading(false)
		}
	}

	const renderForm = (
		<>
			<Stack spacing={3}>
				<TextField
					name="email"
					label="Email"
					type="email"
					value={email}
					onChange={handleChange}
					error={!!error}
					required
					sx={{
						'& .MuiOutlinedInput-root': {
							'&:hover fieldset': {
								borderColor: theme.palette.primary.main,
							},
						},
					}}
				/>
			</Stack>
			{error && (
				<Typography
					color="error"
					variant="body2"
					sx={{ mt: 2 }}>
					{error}
				</Typography>
			)}
			<LoadingButton
				fullWidth
				size="large"
				onClick={handleSubmit}
				variant="contained"
				loading={isLoading}
				sx={{
					mt: 3,
					bgcolor: theme.palette.primary.main,
					color: theme.palette.primary.contrastText,
					'&:hover': {
						bgcolor: theme.palette.primary.dark,
					},
				}}>
				Send Reset Link
			</LoadingButton>
			<Typography
				marginTop={2}
				textAlign="center"
				onClick={() => navigate('/login')}
				sx={{
					color: theme.palette.primary.main,
					cursor: 'pointer',
					'&:hover': {
						color: theme.palette.primary.dark,
						textDecoration: 'underline',
					},
				}}>
				Back to Login
			</Typography>
		</>
	)

	return (
		<Box
			sx={{
				...bgGradient({
					color: alpha(theme.palette.common.black, 0.4),
					imgUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Fbackground%2F20230611%2Foriginal%2Fpngtree-an-antique-musical-instrument-picture-image_3132823.jpg&f=1&nofb=1&ipt=40f5bda6264c41d3f81fcfa66b139f074186706c4272ccb5acd9363c93603783&ipo=images',
				}),
				height: 1,
			}}>
			<Stack
				alignItems="center"
				justifyContent="center"
				sx={{ height: 1 }}>
				<Card
					sx={{
						p: 5,
						width: 1,
						maxWidth: 420,
						backgroundColor: theme.palette.background.paper,
						boxShadow: `0 4px 12px ${alpha(
							theme.palette.primary.main,
							0.15
						)}`,
					}}>
					<Stack
						direction="row"
						alignItems="center"
						spacing={1}
						sx={{ mb: 5 }}>
						<MusicNote
							sx={{
								color: theme.palette.primary.main,
								fontSize: '2rem',
							}}
						/>
						<Typography
							variant="h4"
							sx={{
								color: theme.palette.primary.main,
								fontFamily: theme.typography.fontFamily,
							}}>
							Reset Password
						</Typography>
						<MusicNote
							sx={{
								color: theme.palette.primary.main,
								fontSize: '2rem',
							}}
						/>
					</Stack>

					{renderForm}
				</Card>
			</Stack>
		</Box>
	)
}
