import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTheme, alpha } from '@mui/material/styles'
import { Box, IconButton, Badge } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

export function FloatingCartButton() {
	const theme = useTheme()
	const navigation = useNavigate()
	const cartItems = useSelector((state) => state.cart?.items || [])

	return (
		<Box
			sx={{
				position: 'fixed',
				bottom: 32,
				right: 32,
				zIndex: theme.zIndex.modal + 1,
				border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
				borderRadius: '50%',
				backgroundColor: alpha(theme.palette.background.paper, 0.8),
				backdropFilter: 'blur(4px)',
				'&:hover': {
					transform: 'scale(1.1)',
					transition: theme.transitions.create('transform', {
						duration: theme.transitions.duration.shorter,
					}),
				},
			}}>
			<IconButton
				color="primary"
				onClick={() => navigation('/cart')}
				sx={{
					p: 2.5,
					'&:hover': {
						backgroundColor: alpha(theme.palette.primary.main, 0.1),
					},
				}}>
				<Badge
					badgeContent={cartItems.length}
					color="error"
					anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
					<ShoppingCartIcon sx={{ fontSize: 32 }} />
				</Badge>
			</IconButton>
		</Box>
	)
}
