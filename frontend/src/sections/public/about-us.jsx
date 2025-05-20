import {
	Box,
	Grid,
	Avatar,
	Container,
	Typography,
	Stack,
	useMediaQuery,
} from '@mui/material'
import { MusicNote } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

export default function AboutUsView() {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<Box
			sx={{
				minHeight: 'calc(100vh - 100px)',
				pt: isMobile ? 4 : 8,
				pb: isMobile ? 4 : 6,
			}}>
			<Container maxWidth="lg">
				<Grid
					container
					spacing={isMobile ? 3 : 5}
					alignItems="center">
					<Grid
						item
						xs={12}
						md={6}>
						<Stack spacing={isMobile ? 2 : 3}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 2,
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
									About Our Shop
								</Typography>
							</Box>
							<Typography
								variant="body1"
								paragraph
								sx={{
									color: theme.palette.text.primary,
									fontSize: isMobile ? '1rem' : '1.1rem',
									lineHeight: 1.8,
									fontFamily: theme.typography.fontFamily,
								}}>
								SoundCraft Nepal is an online musical instrument
								store that helps musicians easily find and buy
								quality instruments, accessories, and services.
								It is designed to make shopping simple, secure,
								and convenient from anywhere in Nepal. The shop
								also supports local instrument makers and allows
								users to book repair and maintenance services.
								With proper product information, reviews, and a
								user-friendly design, SoundCraft Nepal aims to
								be a reliable platform for all music lovers.
							</Typography>
							<Typography
								variant="body1"
								paragraph
								sx={{
									color: theme.palette.text.primary,
									fontSize: isMobile ? '1rem' : '1.1rem',
									lineHeight: 1.8,
									fontFamily: theme.typography.fontFamily,
								}}>
								It focuses on providing a smooth shopping
								experience by allowing users to filter products
								by category, brand, and price. Customers can
								also create accounts, manage their orders, and
								save items to their wishlist for future
								purchases. Admins can manage products, users,
								and bookings through a dedicated dashboard.
								SoundCraft Nepal combines e-commerce and
								technical support into one platform, making it
								easier for musicians to get what they need in
								just a few clicks.
							</Typography>
						</Stack>
					</Grid>
					<Grid
						item
						container
						xs={12}
						md={6}
						spacing={isMobile ? 2 : 4}>
						<Grid
							item
							xs={12}>
							<Box
								sx={{
									p: isMobile ? 2 : 4,
									bgcolor: theme.palette.background.paper,
									borderRadius: 2,
									boxShadow: theme.shadows[2],
								}}>
								<Stack
									direction={isMobile ? 'column' : 'row'}
									spacing={isMobile ? 2 : 3}
									alignItems="center">
									<Avatar
										alt="Master Craftsman"
										src="/assets/images/craftsman.jpg"
										sx={{
											width: isMobile ? 80 : 120,
											height: isMobile ? 80 : 120,
											border: `3px solid ${theme.palette.primary.main}`,
											mb: isMobile ? 2 : 0,
										}}
									/>
									<Stack spacing={isMobile ? 1 : 2}>
										<Typography
											variant={isMobile ? 'h6' : 'h5'}
											sx={{
												fontFamily:
													theme.typography.fontFamily,
												color: theme.palette.primary
													.main,
												textAlign: isMobile
													? 'center'
													: 'left',
											}}>
											Our Craftsmen
										</Typography>
										<Typography
											variant="body1"
											sx={{
												color: theme.palette.text
													.primary,
												lineHeight: 1.6,
												fontFamily:
													theme.typography.fontFamily,
												fontSize: isMobile
													? '0.9rem'
													: '1rem',
											}}>
											At SoundCraft Nepal, we proudly
											support skilled local craftsmen who
											create high-quality traditional and
											modern musical instruments. Their
											dedication, experience, and passion
											for music are reflected in every
											product they make. By featuring
											their handcrafted instruments on our
											platform, we help preserve Nepal's
											musical heritage while giving them a
											space to reach wider audiences. Each
											instrument carries a story of
											culture, precision, and
											craftsmanship.
										</Typography>
									</Stack>
								</Stack>
							</Box>
						</Grid>
					</Grid>
				</Grid>
			</Container>
		</Box>
	)
}
