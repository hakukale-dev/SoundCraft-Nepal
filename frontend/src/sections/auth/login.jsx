import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LoadingButton from '@mui/lab/LoadingButton'
import { alpha, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import { MusicNote } from '@mui/icons-material'

import axios from 'src/utils/axios'
import { bgGradient } from 'src/theme/css'
import { useNavigate } from 'react-router-dom'
import { login } from 'src/store/authSlice'
import Iconify from 'src/components/iconify'

export default function LoginView() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const theme = useTheme()

	const [formData, setFormData] = useState({
		username: '',
		password: '',
	})

	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
		setError(null)
	}

	const handleLogin = async (e) => {
		e.preventDefault()
		if (!formData.username || !formData.password) {
			toast.warning('Please fill in all fields')
			return
		}

		setIsLoading(true)
		try {
			const res = await axios.post('api/auth/login/', {
				username: formData.username,
				password: formData.password,
			})

			dispatch(login(res.data))
			toast.success('Login successful!')
			navigate('/')
		} catch (error) {
			const errorMessage =
				error.message || 'Login failed. Please try again.'
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
					name="username"
					label="Username"
					value={formData.username}
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

				<TextField
					name="password"
					label="Password"
					type={showPassword ? 'text' : 'password'}
					value={formData.password}
					onChange={handleChange}
					error={!!error}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={() =>
										setShowPassword(!showPassword)
									}
									edge="end">
									<Iconify
										icon={
											showPassword
												? 'eva:eye-fill'
												: 'eva:eye-off-fill'
										}
									/>
								</IconButton>
							</InputAdornment>
						),
					}}
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
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="flex-end"
				sx={{ my: 3 }}>
				<Link
					variant="subtitle2"
					underline="hover"
					sx={{
						color: theme.palette.primary.main,
						'&:hover': { color: theme.palette.primary.dark },
					}}>
					Forgot password?
				</Link>
			</Stack>
			<LoadingButton
				fullWidth
				size="large"
				onClick={handleLogin}
				variant="contained"
				loading={isLoading}
				sx={{
					bgcolor: theme.palette.primary.main,
					color: theme.palette.primary.contrastText,
					'&:hover': {
						bgcolor: theme.palette.primary.dark,
					},
				}}>
				Login
			</LoadingButton>
			<Typography
				marginTop={2}
				textAlign="center"
				onClick={() => navigate('/signup')}
				sx={{
					color: theme.palette.primary.main,
					cursor: 'pointer',
					'&:hover': {
						color: theme.palette.primary.dark,
						textDecoration: 'underline',
					},
				}}>
				New User? Register here
			</Typography>
			<Typography
				marginTop={2}
				textAlign="center"
				onClick={() => navigate('/')}
				sx={{
					color: theme.palette.primary.main,
					cursor: 'pointer',
					'&:hover': {
						color: theme.palette.primary.dark,
						textDecoration: 'underline',
					},
				}}>
				Back to Homepage
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
							Welcome Back
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
