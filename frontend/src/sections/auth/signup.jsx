import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'
import { Visibility, VisibilityOff, MusicNote } from '@mui/icons-material'
import {
	Box,
	Card,
	alpha,
	Stack,
	TextField,
	Typography,
	IconButton,
	InputAdornment,
	useTheme,
} from '@mui/material'

import axios from 'src/utils/axios'
import { bgGradient } from 'src/theme/css'

export default function SignUpView() {
	const theme = useTheme()
	const navigate = useNavigate()
	const [currentStep, setCurrentStep] = useState(0)

	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		username: '',
		email: '',
		phone_number: '',
		dob: '',
		address: {
			street: '',
			city: '',
			state: '',
			zip_code: '',
		},
		password: '',
		password2: '',
	})

	const [showPassword, setShowPassword] = useState(false)
	const [errors, setErrors] = useState({})
	const [isLoading, setIsLoading] = useState(false)

	const handleChange = (e) => {
		const { name, value } = e.target
		if (name.includes('.')) {
			const [parent, child] = name.split('.')
			setFormData((prev) => ({
				...prev,
				[parent]: { ...prev[parent], [child]: value },
			}))
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }))
		}
	}

	const handleSubmit = async () => {
		setIsLoading(true)
		try {
			await axios.post('/api/auth/register/', formData)
			toast.success('Registration successful! Please login.')
			navigate('/login')
		} catch (err) {
			setErrors(err.response?.data || {})
			toast.error(err.response?.data?.error || 'Registration failed')
		} finally {
			setIsLoading(false)
		}
	}

	const renderStepContent = (step) => {
		switch (step) {
			case 0:
				return (
					<Stack spacing={3}>
						<Stack
							direction="row"
							spacing={2}>
							<TextField
								fullWidth
								label="First Name"
								name="first_name"
								error={!!errors.first_name}
								helperText={errors.first_name}
								onChange={handleChange}
							/>
							<TextField
								fullWidth
								label="Last Name"
								name="last_name"
								error={!!errors.last_name}
								helperText={errors.last_name}
								onChange={handleChange}
							/>
						</Stack>

						<Stack
							direction="row"
							spacing={2}>
							<TextField
								fullWidth
								label="Username"
								name="username"
								error={!!errors.username}
								helperText={errors.username}
								onChange={handleChange}
							/>
							<TextField
								fullWidth
								label="Email"
								type="email"
								name="email"
								error={!!errors.email}
								helperText={errors.email}
								onChange={handleChange}
							/>
						</Stack>
					</Stack>
				)
			case 1:
				return (
					<Stack spacing={3}>
						<TextField
							fullWidth
							label="Phone Number"
							name="phone_number"
							inputProps={{ maxLength: 10 }}
							error={!!errors.phone_number}
							helperText={errors.phone_number}
							onChange={handleChange}
						/>

						<TextField
							fullWidth
							label="Date of Birth"
							type="date"
							InputLabelProps={{ shrink: true }}
							name="dob"
							error={!!errors.dob}
							helperText={errors.dob}
							onChange={handleChange}
						/>
					</Stack>
				)
			case 2:
				return (
					<Stack spacing={3}>
						<TextField
							fullWidth
							label="Street Address"
							name="address.street"
							error={!!errors.address?.street}
							helperText={errors.address?.street}
							onChange={handleChange}
						/>
						<Stack
							direction="row"
							spacing={2}>
							<TextField
								fullWidth
								label="City"
								name="address.city"
								error={!!errors.address?.city}
								helperText={errors.address?.city}
								onChange={handleChange}
							/>
							<TextField
								fullWidth
								label="State"
								name="address.state"
								error={!!errors.address?.state}
								helperText={errors.address?.state}
								onChange={handleChange}
							/>
							<TextField
								fullWidth
								label="ZIP Code"
								name="address.zip_code"
								error={!!errors.address?.zip_code}
								helperText={errors.address?.zip_code}
								onChange={handleChange}
							/>
						</Stack>
					</Stack>
				)
			case 3:
				return (
					<Stack spacing={3}>
						<TextField
							fullWidth
							label="Password"
							type={showPassword ? 'text' : 'password'}
							name="password"
							error={!!errors.password}
							helperText={errors.password}
							onChange={handleChange}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() =>
												setShowPassword(!showPassword)
											}
											edge="end">
											{showPassword ? (
												<VisibilityOff />
											) : (
												<Visibility />
											)}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>

						<TextField
							fullWidth
							label="Confirm Password"
							type={showPassword ? 'text' : 'password'}
							name="password2"
							error={!!errors.password2}
							helperText={errors.password2}
							onChange={handleChange}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() =>
												setShowPassword(!showPassword)
											}
											edge="end">
											{showPassword ? (
												<VisibilityOff />
											) : (
												<Visibility />
											)}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Stack>
				)
			default:
				return null
		}
	}

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
						maxWidth: 560,
						backgroundColor: theme.palette.background.paper,
					}}>
					<Stack
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
							sx={{ color: theme.palette.primary.main }}>
							Create Account
						</Typography>
						<MusicNote
							sx={{
								color: theme.palette.primary.main,
								fontSize: '2rem',
							}}
						/>
					</Stack>

					{renderStepContent(currentStep)}

					<Stack
						direction="row"
						spacing={2}
						sx={{ mt: 3 }}>
						{currentStep > 0 && (
							<LoadingButton
								fullWidth
								size="large"
								variant="outlined"
								onClick={() =>
									setCurrentStep((prev) => prev - 1)
								}>
								Previous
							</LoadingButton>
						)}
						{currentStep < 3 ? (
							<LoadingButton
								fullWidth
								size="large"
								variant="contained"
								onClick={() =>
									setCurrentStep((prev) => prev + 1)
								}>
								Next
							</LoadingButton>
						) : (
							<LoadingButton
								fullWidth
								size="large"
								variant="contained"
								onClick={handleSubmit}
								loading={isLoading}>
								Sign Up
							</LoadingButton>
						)}
					</Stack>

					<Typography
						sx={{
							mt: 2,
							textAlign: 'center',
							color: 'primary.main',
							cursor: 'pointer',
							'&:hover': { textDecoration: 'underline' },
						}}
						onClick={() => navigate('/login')}>
						Already have an account? Login here
					</Typography>

					<Typography
						sx={{
							mt: 2,
							textAlign: 'center',
							color: 'primary.main',
							cursor: 'pointer',
							'&:hover': { textDecoration: 'underline' },
						}}
						onClick={() => navigate('/')}>
						Back to Homepage
					</Typography>
				</Card>
			</Stack>
		</Box>
	)
}
