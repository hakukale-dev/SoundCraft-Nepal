import { useTheme } from '@mui/material/styles'
import { Error as ErrorIcon } from '@mui/icons-material'
import {
	Container,
	Stack,
	Button,
	Typography,
	Card,
	Box,
	useMediaQuery,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

function PaymentFailureView() {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const navigate = useNavigate()

	return (
		<Container sx={{ py: isMobile ? 3 : 5 }}>
			<Card
				sx={{
					p: isMobile ? 2 : 5,
					maxWidth: 720,
					mx: 'auto',
					backgroundColor: theme.palette.background.paper,
					boxShadow: `0 4px 12px ${theme.palette.error.main}25`,
				}}>
				<Stack
					alignItems="center"
					spacing={isMobile ? 2 : 3}>
					<ErrorIcon
						sx={{
							color: theme.palette.error.main,
							fontSize: isMobile ? 60 : 80,
						}}
					/>

					<Typography
						variant={isMobile ? 'h5' : 'h4'}
						align="center"
						sx={{
							color: theme.palette.error.main,
							fontWeight: 700,
						}}>
						Payment Failed
					</Typography>

					<Typography
						variant={isMobile ? 'body2' : 'body1'}
						align="center">
						We're sorry, your payment could not be processed. Please
						check your payment details and try again.
					</Typography>

					<Box sx={{ width: '100%', mt: 3 }}>
						<Stack spacing={2}>
							<Button
								fullWidth
								variant="contained"
								color="error"
								size={isMobile ? 'medium' : 'large'}
								onClick={() => navigate('/checkout')}>
								Retry Payment
							</Button>

							<Button
								fullWidth
								variant="outlined"
								size={isMobile ? 'medium' : 'large'}
								onClick={() => navigate('/')}
								sx={{
									borderColor: theme.palette.error.main,
									color: theme.palette.error.main,
									'&:hover': {
										borderColor: theme.palette.error.dark,
									},
								}}>
								Return to Home
							</Button>
						</Stack>
					</Box>
				</Stack>
			</Card>
		</Container>
	)
}

export default PaymentFailureView
