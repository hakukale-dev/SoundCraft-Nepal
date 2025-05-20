import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { useTheme, alpha } from '@mui/material/styles'
import {
	Box,
	Stack,
	Button,
	IconButton,
	Badge,
	Drawer,
	List,
	ListItem,
	useMediaQuery,
} from '@mui/material'
import Iconify from 'src/components/iconify'

import { bgBlur } from 'src/theme/css'
import { selectCartDetails } from 'src/store/cartSlice'
import Logo from 'src/components/logo'
import ThemeModeToggle from 'src/components/color-utils/ThemeModeToggle'

import navConfig from './config-navigation'
import AccountPopover from '../common/account-popover'

function BasicHeader() {
	const { isAuthenticated, user } = useSelector((state) => state.auth)
	const { items } = useSelector((state) =>
		selectCartDetails(state, user?._id)
	)
	const theme = useTheme()
	const navigation = useNavigate()
	const isMobile = useMediaQuery(theme.breakpoints.down('md'))
	const [mobileOpen, setMobileOpen] = useState(false)

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}

	const renderMobileMenu = (
		<Drawer
			anchor="right"
			open={mobileOpen}
			onClose={handleDrawerToggle}
			sx={{
				'& .MuiDrawer-paper': {
					width: 240,
					boxSizing: 'border-box',
					background: theme.palette.background.default,
				},
			}}>
			<List>
				{navConfig.map((page) => (
					<ListItem
						key={page.title}
						sx={{ py: 1 }}>
						<Button
							fullWidth
							onClick={() => {
								navigation(page.path)
								handleDrawerToggle()
							}}
							sx={{
								color: theme.palette.text.primary,
								textTransform: 'none',
								justifyContent: 'flex-start',
							}}>
							{page.title}
						</Button>
					</ListItem>
				))}
				{!isAuthenticated ? (
					<>
						<ListItem sx={{ py: 1 }}>
							<Button
								fullWidth
								onClick={() => {
									navigation('/login')
									handleDrawerToggle()
								}}
								sx={{
									color: theme.palette.text.primary,
									textTransform: 'none',
									justifyContent: 'flex-start',
								}}>
								Login
							</Button>
						</ListItem>
						<ListItem sx={{ py: 1 }}>
							<Button
								fullWidth
								onClick={() => {
									navigation('/signup')
									handleDrawerToggle()
								}}
								sx={{
									color: theme.palette.text.primary,
									textTransform: 'none',
									justifyContent: 'flex-start',
								}}>
								Sign Up
							</Button>
						</ListItem>
					</>
				) : (
					<ListItem sx={{ py: 1 }}>
						<AccountPopover
							sx={{
								width: '100%',
								justifyContent: 'flex-start',
								textTransform: 'none',
								color: theme.palette.text.primary,
							}}
						/>
					</ListItem>
				)}
			</List>
		</Drawer>
	)

	return (
		<AppBar
			sx={{
				boxShadow: theme.shadows[1],
				height: { xs: '70px', md: '100px' },
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
					px: { xs: 2, lg: 20 },
					minHeight: { xs: '60px !important', md: '80px !important' },
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

				{!isMobile && (
					<Stack
						direction="row"
						alignItems="center"
						gap={3}
						sx={{
							marginLeft: 4,
							display: { xs: 'none', md: 'flex' },
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
				)}

				<Box sx={{ flexGrow: 1 }} />

				{isMobile ? (
					<>
						<IconButton
							onClick={handleDrawerToggle}
							sx={{
								color: theme.palette.primary.main,
								ml: 1,
							}}>
							<Iconify
								icon="eva:menu-2-fill"
								width={24}
							/>
						</IconButton>
						{renderMobileMenu}
					</>
				) : (
					<>
						{user && isAuthenticated ? (
							<Stack
								direction="row"
								alignItems="center"
								spacing={{ xs: 1, md: 4 }}>
								{user.is_superuser && (
									<Button
										variant="outlined"
										onClick={() => navigation('dashboard')}
										sx={{
											color: theme.palette.primary.main,
											borderColor:
												theme.palette.primary.main,
											height: '48px',
											'&:hover': {
												borderColor:
													theme.palette.primary.dark,
												bgcolor: alpha(
													theme.palette.primary.main,
													0.08
												),
											},
										}}>
										Dashboard
									</Button>
								)}
								<ThemeModeToggle />
								<IconButton
									onClick={() => navigation('/cart')}
									sx={{
										color: theme.palette.primary.main,
										'&:hover': {
											color: theme.palette.primary.dark,
											transform: 'scale(1.1)',
											transition:
												theme.transitions.create(
													['transform', 'color'],
													{
														duration:
															theme.transitions
																.duration
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
								<AccountPopover />
							</Stack>
						) : (
							<Stack
								direction="row"
								spacing={2}>
								<ThemeModeToggle />
								<Button
									variant="outlined"
									onClick={() => navigation('signup')}
									sx={{
										color: theme.palette.primary.main,
										borderColor: theme.palette.primary.main,
										height: '48px',
										'&:hover': {
											borderColor:
												theme.palette.primary.dark,
											bgcolor: alpha(
												theme.palette.primary.main,
												0.08
											),
											transform: 'translateY(-2px)',
											transition:
												theme.transitions.create(
													[
														'border-color',
														'background-color',
														'transform',
													],
													{
														duration:
															theme.transitions
																.duration
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
											transition:
												theme.transitions.create(
													[
														'background-color',
														'transform',
													],
													{
														duration:
															theme.transitions
																.duration
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
					</>
				)}
			</Toolbar>
		</AppBar>
	)
}

export default BasicHeader
