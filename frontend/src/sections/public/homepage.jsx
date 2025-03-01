import { useTheme } from '@mui/material/styles'
import Carousel from 'react-material-ui-carousel'

import {
	Card,
	Grid,
	Stack,
	Button,
	CardMedia,
	Container,
	Typography,
	CardContent,
	Box,
} from '@mui/material'

const categories = {
	'Electric Guitars':
		'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fimages5.fanpop.com%2Fimage%2Fphotos%2F27300000%2FLes-Paul-guitar-27367484-1920-1200.jpg&f=1&nofb=1&ipt=97502988971c35c5c38e9c18f348d79f49c8cbc327db9a431762f02bdf8362c7&ipo=images',
	'Acoustic Guitars':
		'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.wallpapersafari.com%2F34%2F23%2FucRNav.jpg&f=1&nofb=1&ipt=701d1fc5fb87acf9c6a73a38e78e43c052f87c776527bfa893bddddef28fdda7&ipo=images',
	'Bass Guitars':
		'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.talkbass.com%2Fattachments%2Fwyn-97-pic-jpeg.661004%2F&f=1&nofb=1&ipt=d60661418dcf0e95640e17a51882473b46008f927726fad0d03ea52270b5ebd0&ipo=images',
}

const carouselItems = [
	{
		image: 'https://images.unsplash.com/photo-1550984358-5d9144528f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
		title: 'Premium Guitar Selection',
		description: 'Explore our handpicked collection of finest guitars',
	},
	{
		image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
		title: 'Summer Sale Live Now',
		description: 'Up to 30% off on selected electric guitars',
	},
]

function HomepageView() {
	const theme = useTheme()

	return (
		<Box sx={{ py: 5 }}>
			<Box sx={{ mb: 8 }}>
				<Carousel
					animation="fade"
					indicators={true}
					navButtonsAlwaysVisible={true}
					height={500}
					autoPlay={true}
					interval={5000}>
					{carouselItems.map((item, i) => (
						<Box
							key={i}
							sx={{ position: 'relative', height: 500 }}>
							<CardMedia
								component="img"
								image={item.image}
								alt={item.title}
								sx={{
									height: '100%',
									objectFit: 'cover',
									filter: 'brightness(0.7)',
								}}
							/>
							<Box
								sx={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									textAlign: 'center',
									color: 'white',
								}}>
								<Typography
									variant="h2"
									sx={{
										fontWeight: 700,
										mb: 2,
										textShadow:
											'2px 2px 4px rgba(0,0,0,0.5)',
									}}>
									{item.title}
								</Typography>
								<Typography
									variant="h5"
									sx={{
										textShadow:
											'1px 1px 2px rgba(0,0,0,0.5)',
									}}>
									{item.description}
								</Typography>
							</Box>
						</Box>
					))}
				</Carousel>
			</Box>
			<Container maxWidth="xl">
				<Grid
					container
					spacing={4}>
					<Grid
						item
						xs={12}
						md={6}>
						<Box
							sx={{
								p: 3,
								bgcolor: 'background.paper',
								borderRadius: 2,
								boxShadow: theme.shadows[4],
							}}>
							<Typography
								variant="h3"
								gutterBottom
								sx={{
									fontFamily: theme.typography.fontFamily,
									color: theme.palette.text.primary,
								}}>
								Discover Your Perfect Sound at GuitarHub
							</Typography>
							<Typography
								variant="body1"
								paragraph
								sx={{
									color: theme.palette.text.secondary,
									fontSize: '1.1rem',
									lineHeight: 1.8,
								}}>
								Welcome to GuitarHub, your premier destination
								for quality guitars and musical equipment. From
								vintage acoustics to modern electric guitars, we
								offer a carefully curated selection of
								instruments for players of all skill levels. Our
								expert staff is here to help you find the
								perfect instrument to match your style and
								sound.
							</Typography>
							<Button
								variant="contained"
								size="large"
								sx={{
									bgcolor: theme.palette.primary.main,
									'&:hover': {
										bgcolor: theme.palette.primary.dark,
									},
									px: 4,
									py: 1.5,
									borderRadius: 2,
								}}>
								Explore Guitars
							</Button>
						</Box>
					</Grid>
					<Grid
						item
						xs={12}
						md={6}>
						<Card
							sx={{
								display: 'flex',
								flexDirection: 'column',
								borderRadius: 2,
								boxShadow: theme.shadows[4],
								bgcolor: theme.palette.background.paper,
							}}>
							<CardMedia
								component="img"
								image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2F7CHUvpx.jpg&f=1&nofb=1&ipt=652940ba0a656c3b5863be61f431ad69d003bd570e85c6d659b932e2db750189&ipo=images"
								alt="Featured Guitar"
								sx={{
									width: '100%',
									height: 400,
									objectFit: 'cover',
								}}
							/>
							<CardContent sx={{ flexGrow: 1, p: 3 }}>
								<Stack
									direction="column"
									spacing={2}>
									<Typography
										variant="h5"
										gutterBottom
										sx={{
											color: theme.palette.primary.main,
											fontWeight: 600,
										}}>
										New Arrival Special!
									</Typography>
									<Typography
										variant="body1"
										sx={{
											color: theme.palette.text.secondary,
										}}>
										Get 15% off on all Gibson guitars this
										month. Plus, free setup and first
										maintenance included!
									</Typography>
									<Button
										variant="outlined"
										size="medium"
										sx={{
											color: theme.palette.primary.main,
											borderColor:
												theme.palette.primary.main,
											'&:hover': {
												borderColor:
													theme.palette.primary.dark,
												bgcolor:
													theme.palette.action.hover,
											},
										}}>
										View Special Offers
									</Button>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				<Grid
					container
					spacing={4}
					sx={{ mt: 6 }}>
					<Grid
						item
						xs={12}>
						<Typography
							variant="h4"
							gutterBottom
							sx={{
								textAlign: 'center',
								color: theme.palette.text.primary,
							}}>
							Categories
						</Typography>
					</Grid>
					{Object.keys(categories).map((category) => (
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							key={category}>
							<Card
								sx={{
									borderRadius: 2,
									boxShadow: theme.shadows[4],
									transition: 'transform 0.3s ease-in-out',
									'&:hover': {
										transform: 'translateY(-8px)',
									},
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
								}}>
								<Box sx={{ pt: '100%', position: 'relative' }}>
									<CardMedia
										component="img"
										image={categories[category]}
										alt={category}
										sx={{
											position: 'absolute',
											top: 0,
											left: 0,
											width: '100%',
											height: '100%',
											objectFit: 'cover',
										}}
									/>
								</Box>
								<CardContent
									sx={{
										bgcolor: theme.palette.background.paper,
										p: 3,
										flexGrow: 1,
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'space-between',
									}}>
									<Typography
										variant="h6"
										gutterBottom
										sx={{
											color: theme.palette.primary.main,
											fontWeight: 600,
										}}>
										{category}
									</Typography>
									<Button
										variant="contained"
										size="medium"
										sx={{
											bgcolor: theme.palette.primary.main,
											'&:hover': {
												bgcolor:
													theme.palette.primary.dark,
											},
											width: '100%',
										}}>
										Browse {category}
									</Button>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>

				<Grid
					container
					spacing={4}
					sx={{ mt: 6 }}>
					<Grid
						item
						xs={12}>
						<Typography
							variant="h4"
							gutterBottom
							sx={{
								textAlign: 'center',
								color: theme.palette.text.primary,
							}}>
							Featured Accessories
						</Typography>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={4}>
						<Card>
							<CardMedia
								component="img"
								image="https://example.com/path/to/accessory1.jpg"
								alt="Guitar Strap"
							/>
							<CardContent>
								<Typography variant="h6">
									Guitar Strap
								</Typography>
								<Typography variant="body2">
									Comfortable and stylish guitar strap.
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={4}>
						<Card>
							<CardMedia
								component="img"
								image="https://example.com/path/to/accessory2.jpg"
								alt="Guitar Picks"
							/>
							<CardContent>
								<Typography variant="h6">
									Guitar Picks
								</Typography>
								<Typography variant="body2">
									High-quality picks for every player.
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={4}>
						<Card>
							<CardMedia
								component="img"
								image="https://example.com/path/to/accessory3.jpg"
								alt="Capo"
							/>
							<CardContent>
								<Typography variant="h6">Capo</Typography>
								<Typography variant="body2">
									Essential tool for every guitarist.
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</Box>
	)
}

export default HomepageView
