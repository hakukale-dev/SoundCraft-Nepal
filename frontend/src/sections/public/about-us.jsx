import { Box, Grid, Avatar, Container, Typography, Stack } from '@mui/material'
import { MusicNote } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

export default function AboutUsView() {
	const theme = useTheme()

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
					spacing={5}
					alignItems="center">
					<Grid
						item
						xs={12}
						md={6}>
						<Stack spacing={3}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 2,
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
									About Our Shop
								</Typography>
							</Box>
							<Typography
								variant="body1"
								paragraph
								sx={{
									color: theme.palette.text.primary,
									fontSize: '1.1rem',
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
									fontSize: '1.1rem',
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
						spacing={4}>
						<Grid
							item
							xs={12}>
							<Box
								sx={{
									p: 4,
									bgcolor: theme.palette.background.paper,
									borderRadius: 2,
									boxShadow: theme.shadows[2],
								}}>
								<Stack
									direction="row"
									spacing={3}
									alignItems="center">
									<Avatar
										alt="Master Craftsman"
										src="/assets/images/craftsman.jpg"
										sx={{
											width: 120,
											height: 120,
											border: `3px solid ${theme.palette.primary.main}`,
										}}
									/>
									<Stack spacing={2}>
										<Typography
											variant="h5"
											sx={{
												fontFamily:
													theme.typography.fontFamily,
												color: theme.palette.primary
													.main,
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
											}}>
											At SoundCraft Nepal, we proudly
											support skilled local craftsmen who
											create high-quality traditional and
											modern musical instruments. Their
											dedication, experience, and passion
											for music are reflected in every
											product they make. By featuring
											their handcrafted instruments on our
											platform, we help preserve Nepal’s
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
