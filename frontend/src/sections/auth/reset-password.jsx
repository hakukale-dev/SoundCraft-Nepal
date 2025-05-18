import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useSearchParams } from 'react-router-dom'

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

export default function ResetPasswordView() {
	const navigate = useNavigate()
	const theme = useTheme()
	const [searchParams] = useSearchParams()
	const token = searchParams.get('token')

	const [formData, setFormData] = useState({
		email: '',
		newPassword: '',
		otp: '',
	})

	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
		setError(null)
	}

	const handleResetPassword = async (e) => {
		e.preventDefault()
		if (
			!formData.email ||
			!formData.newPassword ||
			(!formData.otp && !token)
		) {
			toast.warning('Please fill in all required fields')
			return
		}

		setIsLoading(true)
		try {
			await axios.post('api/auth/reset-password', {
				email: formData.email,
				newPassword: formData.newPassword,
				otp: formData.otp,
				token,
			})

			toast.success('Password reset successfully!')
			navigate('/login')
		} catch (error) {
			const errorMessage =
				error.response?.data?.error ||
				'Password reset failed. Please try again.'
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
					value={formData.email}
					onChange={handleChange}
					error={!!error}
					required
				/>

				{!token && (
					<TextField
						name="otp"
						label="OTP"
						value={formData.otp}
						onChange={handleChange}
						error={!!error}
						required={!token}
					/>
				)}

				<TextField
					name="newPassword"
					label="New Password"
					type="password"
					value={formData.newPassword}
					onChange={handleChange}
					error={!!error}
					required
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
				onClick={handleResetPassword}
				variant="contained"
				loading={isLoading}
				sx={{ mt: 3 }}>
				Reset Password
			</LoadingButton>
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
