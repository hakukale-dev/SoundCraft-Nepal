import { useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Popover from '@mui/material/Popover'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Box from '@mui/material/Box'

import Iconify from 'src/components/iconify'

// ----------------------------------------------------------------------

export default function ArticleCard({
	selected,
	title,
	category,
	difficultyLevel,
	description,
	thumbnail,
	videoUrl,
	handleEdit,
	handleDelete,
	handleInfoPopup,
}) {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const [open, setOpen] = useState(null)

	const handleOpenMenu = (event) => {
		setOpen(event.currentTarget)
	}

	const handleCloseMenu = () => {
		setOpen(null)
	}

	return (
		<Card
			sx={{
				maxWidth: isMobile ? '100%' : 345,
				m: isMobile ? 1 : 2,
				borderRadius: 2,
				boxShadow: 3,
			}}>
			{/* Thumbnail */}
			<CardMedia
				component="img"
				height={isMobile ? '140' : '180'}
				image={thumbnail}
				alt={title}
				sx={{
					objectFit: 'cover',
					borderTopLeftRadius: 2,
					borderTopRightRadius: 2,
				}}
			/>
			{/* Content */}
			<CardContent>
				<Typography
					gutterBottom
					variant="h6"
					component="div"
					sx={{
						fontWeight: 'bold',
						fontSize: isMobile ? 16 : 18,
						color: 'text.primary',
					}}>
					{title}
				</Typography>
				<Stack spacing={1}>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{
							fontWeight: 'bold',
							fontSize: isMobile ? 12 : 14,
						}}>
						Category: {category}
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{
							fontWeight: 'bold',
							fontSize: isMobile ? 12 : 14,
						}}>
						Difficulty: {difficultyLevel}
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ fontSize: isMobile ? 12 : 14 }}>
						{description}
					</Typography>
				</Stack>
			</CardContent>
			{/* Card Actions */}
			<CardActions disableSpacing>
				<IconButton
					onClick={handleOpenMenu}
					size={isMobile ? 'small' : 'medium'}>
					<Iconify
						icon="eva:more-vertical-fill"
						width={isMobile ? 20 : 24}
					/>
				</IconButton>
			</CardActions>

			{/* Popover Menu */}
			<Popover
				open={!!open}
				anchorEl={open}
				onClose={handleCloseMenu}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				PaperProps={{
					sx: {
						width: isMobile ? 140 : 160,
						borderRadius: 2,
						boxShadow: 2,
					},
				}}>
				<MenuItem onClick={handleInfoPopup}>
					<Iconify
						icon="eva:info-outline"
						sx={{
							mr: 2,
							color: 'info.main',
							width: isMobile ? 18 : 20,
						}}
					/>
					Info
				</MenuItem>
				<MenuItem onClick={handleEdit}>
					<Iconify
						icon="eva:edit-fill"
						sx={{
							mr: 2,
							color: 'primary.main',
							width: isMobile ? 18 : 20,
						}}
					/>
					Edit
				</MenuItem>
				<MenuItem
					onClick={handleDelete}
					sx={{ color: 'error.main' }}>
					<Iconify
						icon="eva:trash-2-outline"
						sx={{ mr: 2, width: isMobile ? 18 : 20 }}
					/>
					Delete
				</MenuItem>
			</Popover>
		</Card>
	)
}

ArticleCard.propTypes = {
	id: PropTypes.string,
	title: PropTypes.string.isRequired,
	category: PropTypes.string.isRequired,
	difficultyLevel: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	thumbnail: PropTypes.string.isRequired,
	videoUrl: PropTypes.string,
	selected: PropTypes.bool,
	handleClick: PropTypes.func,
	handleEdit: PropTypes.func,
	handleDelete: PropTypes.func,
	handleInfoPopup: PropTypes.func,
}
