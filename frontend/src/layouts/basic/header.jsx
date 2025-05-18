import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { useTheme, alpha } from '@mui/material/styles'
import { Box, Stack, Button, IconButton, Badge } from '@mui/material'
import Iconify from 'src/components/iconify'

import { bgBlur } from 'src/theme/css'
import { selectCartDetails } from 'src/store/cartSlice'
import Logo from 'src/components/logo'

import navConfig from './config-navigation'
import AccountPopover from '../common/account-popover'
// import NotificationsPopover from '../common/notifications-popover';

function BasicHeader() {
	const { isAuthenticated, user } = useSelector((state) => state.auth)
	const { items } = useSelector((state) =>
		selectCartDetails(state, user?._id)
	)
	const theme = useTheme()
	const navigation = useNavigate()

	return (
		<AppBar
			sx={{
				boxShadow: theme.shadows[1],
				height: '100px',
				zIndex: theme.zIndex.appBar + 1,
				...bgBlur({
					color: theme.palette.background.default,
				}),
				transition: theme.transitions.create(['height'], {
					duration: theme.transitions.duration.shorter,
				}),
			}}>
			<Toolbar
				sx={{
					height: 1,
					px: { lg: 20 },
					minHeight: '80px !important',
				}}>
				<IconButton
					onClick={() => navigation('/')}
					sx={{
						p: 0,
						'&:hover': {
							transform: 'scale(1.05)',
							transition: theme.transitions.create('transform', {
								duration: theme.transitions.duration.shorter,
							}),
						},
					}}>
					<Logo />
				</IconButton>

				<Stack
					direction="row"
					alignItems="center"
					gap={3}
					sx={{
						marginLeft: 4,
					}}>
					{navConfig.map((page) => (
						<Button
							key={page.title}
							onClick={() => navigation(page.path)}
							sx={{
								color: theme.palette.primary.main,
								display: 'block',
								fontFamily: theme.typography.fontFamily,
								fontSize: theme.typography.h6.fontSize,
								textTransform: 'none',
								py: 2,
								'&:hover': {
									color: theme.palette.primary.dark,
									bgcolor: alpha(
										theme.palette.primary.main,
										0.08
									),
									transform: 'translateY(-2px)',
									transition: theme.transitions.create(
										[
											'color',
											'background-color',
											'transform',
										],
										{
											duration:
												theme.transitions.duration
													.shorter,
										}
									),
								},
							}}>
							{page.title}
						</Button>
					))}
				</Stack>

				<Box sx={{ flexGrow: 1 }} />

				{user && isAuthenticated ? (
					<Stack
						direction="row"
						alignItems="center"
						spacing={4}>
						{user.is_superuser && (
							<Button
								variant="outlined"
								onClick={() => navigation('dashboard')}
								sx={{
									color: theme.palette.primary.main,
									borderColor: theme.palette.primary.main,
									height: '48px',
									'&:hover': {
										borderColor: theme.palette.primary.dark,
										bgcolor: alpha(
											theme.palette.primary.main,
											0.08
										),
									},
								}}>
								Dashboard
							</Button>
						)}
						<IconButton
							onClick={() => navigation('/cart')}
							sx={{
								color: theme.palette.primary.main,
								'&:hover': {
									color: theme.palette.primary.dark,
									transform: 'scale(1.1)',
									transition: theme.transitions.create(
										['transform', 'color'],
										{
											duration:
												theme.transitions.duration
													.shorter,
										}
									),
								},
							}}>
							<Badge
								badgeContent={items.length}
								color="error"
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}>
								<Iconify
									icon="eva:shopping-cart-fill"
									width={24}
								/>
							</Badge>
						</IconButton>
						{/* <NotificationsPopover /> */}
						<AccountPopover />
					</Stack>
				) : (
					<Stack
						direction="row"
						spacing={2}>
						<Button
							variant="outlined"
							onClick={() => navigation('signup')}
							sx={{
								color: theme.palette.primary.main,
								borderColor: theme.palette.primary.main,
								height: '48px',
								'&:hover': {
									borderColor: theme.palette.primary.dark,
									bgcolor: alpha(
										theme.palette.primary.main,
										0.08
									),
									transform: 'translateY(-2px)',
									transition: theme.transitions.create(
										[
											'border-color',
											'background-color',
											'transform',
										],
										{
											duration:
												theme.transitions.duration
													.shorter,
										}
									),
								},
								px: 3,
								borderRadius: 2,
							}}>
							Sign Up
						</Button>
						<Button
							variant="contained"
							onClick={() => navigation('login')}
							sx={{
								bgcolor: theme.palette.primary.main,
								height: '48px',
								'&:hover': {
									bgcolor: theme.palette.primary.dark,
									transform: 'translateY(-2px)',
									transition: theme.transitions.create(
										['background-color', 'transform'],
										{
											duration:
												theme.transitions.duration
													.shorter,
										}
									),
								},
								px: 3,
								borderRadius: 2,
								boxShadow: theme.shadows[2],
							}}>
							Sign In
						</Button>
					</Stack>
				)}
			</Toolbar>
		</AppBar>
	)
}

export default BasicHeader
