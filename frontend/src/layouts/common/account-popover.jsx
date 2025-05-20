import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from '@mui/material'

import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Popover from '@mui/material/Popover'
import { alpha, useTheme } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import { logout } from 'src/store/authSlice'

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
	{
		label: 'Home',
		icon: 'eva:home-fill',
		link: '/',
		slug: 'home',
	},
	{
		label: 'Profile',
		icon: 'eva:person-fill',
		link: 'profile',
		slug: 'profile',
	},
	{
		label: 'Wishlist',
		icon: 'eva:heart-fill',
		link: 'wishlist',
		slug: 'wishlist',
	},
	{
		label: 'Purchase History',
		icon: 'eva:shopping-bag-fill',
		link: 'purchase-history',
		slug: 'purchase-history',
	},
	{
		label: 'Dashboard',
		icon: 'eva:grid-fill',
		link: 'admin/dashboard',
		slug: 'dashboard',
	},
]

// ----------------------------------------------------------------------

export default function AccountPopover() {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const { user } = useSelector((state) => state.auth)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [open, setOpen] = useState(null)

	const handleLogout = async () => {
		try {
			dispatch(logout())
			navigate('/')
		} catch (error) {
			console.error('Logout error:', error)
		}
	}

	const handleOpen = (event) => {
		setOpen(event.currentTarget)
	}

	const handleClose = () => {
		setOpen(null)
	}

	const fullName = `${user.first_name} ${user.last_name}`

	return (
		<>
			<IconButton
				onClick={handleOpen}
				sx={{
					width: isMobile ? 32 : 40,
					height: isMobile ? 32 : 40,
					background: alpha(theme.palette.grey[500], 0.08),
					...(open && {
						background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
					}),
				}}>
				<Avatar
					src={user.photo}
					alt={fullName}
					sx={{
						width: isMobile ? 28 : 36,
						height: isMobile ? 28 : 36,
						border: `solid 2px ${theme.palette.background.default}`,
					}}>
					{fullName.charAt(0).toUpperCase()}
				</Avatar>
			</IconButton>

			<Popover
				open={!!open}
				anchorEl={open}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				PaperProps={{
					sx: {
						p: 0,
						mt: 1,
						ml: 0.75,
						width: isMobile ? 180 : 200,
						backgroundColor: theme.palette.background.paper,
						boxShadow: theme.shadows[3],
					},
				}}>
				<Box sx={{ my: 1, px: 2 }}>
					<Typography
						variant={isMobile ? 'body2' : 'subtitle2'}
						noWrap
						sx={{
							color: theme.palette.text.primary,
							fontFamily: theme.typography.fontFamily,
							fontSize: isMobile ? '0.875rem' : '1rem',
						}}>
						{fullName}
					</Typography>
					<Typography
						variant="body2"
						sx={{
							color: theme.palette.text.secondary,
							fontFamily: theme.typography.fontFamily,
							fontSize: isMobile ? '0.75rem' : '0.875rem',
						}}
						noWrap>
						{user.email}
					</Typography>
					<Typography
						variant="caption"
						sx={{
							color: theme.palette.text.secondary,
							fontFamily: theme.typography.fontFamily,
							fontSize: isMobile ? '0.65rem' : '0.75rem',
						}}
						noWrap>
						{user.username}
					</Typography>
				</Box>

				<Divider
					sx={{
						borderStyle: 'dashed',
						borderColor: theme.palette.divider,
					}}
				/>

				{MENU_OPTIONS.map((option) => {
					if (option.slug === 'dashboard' && user.is_admin !== true) {
						return null
					}

					return (
						<MenuItem
							key={option.label}
							onClick={() => {
								navigate(option.link)
								handleClose()
							}}
							sx={{
								color: theme.palette.text.primary,
								fontFamily: theme.typography.fontFamily,
								fontSize: isMobile ? '0.875rem' : '1rem',
								py: isMobile ? 0.75 : 1,
								'&:hover': {
									backgroundColor: theme.palette.action.hover,
								},
							}}>
							{option.label}
						</MenuItem>
					)
				})}

				<Divider
					sx={{
						borderStyle: 'dashed',
						borderColor: theme.palette.divider,
						m: 0,
					}}
				/>

				<MenuItem
					disableRipple
					disableTouchRipple
					onClick={handleLogout}
					sx={{
						typography: 'body2',
						color: theme.palette.error.main,
						py: isMobile ? 1 : 1.5,
						fontFamily: theme.typography.fontFamily,
						fontSize: isMobile ? '0.875rem' : '1rem',
						'&:hover': {
							backgroundColor: theme.palette.error.lighter,
						},
					}}>
					Logout
				</MenuItem>
			</Popover>
		</>
	)
}
