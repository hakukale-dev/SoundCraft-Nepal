import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export default function ChatSidebar({ activeChat, setActiveChat, chats }) {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<Box
			sx={{
				width: '100%',
				height: '100%',
				borderRight: isMobile
					? 'none'
					: `1px solid ${theme.palette.divider}`,
			}}>
			<Box
				sx={{
					p: isMobile ? 1 : 2,
					borderBottom: `1px solid ${theme.palette.divider}`,
				}}>
				<Typography variant={isMobile ? 'subtitle1' : 'h6'}>
					Chats
				</Typography>
			</Box>
			<List sx={{ overflowY: 'auto', height: 'calc(100% - 64px)' }}>
				{chats.map((chat) => (
					<ListItem
						key={chat.id}
						disablePadding
						onClick={() => setActiveChat(chat.id)}
						sx={{
							bgcolor:
								activeChat === chat.id
									? theme.palette.action.selected
									: 'transparent',
						}}>
						<ListItemButton sx={{ py: isMobile ? 0.5 : 1 }}>
							<ListItemText
								primary={chat.name}
								secondary={chat.lastMessage}
								primaryTypographyProps={{
									fontWeight:
										chat.unread > 0 ? 'bold' : 'normal',
									fontSize: isMobile ? '0.875rem' : '1rem',
								}}
								secondaryTypographyProps={{
									color:
										chat.unread > 0
											? 'text.primary'
											: 'text.secondary',
									fontSize: isMobile ? '0.75rem' : '0.875rem',
									noWrap: true,
								}}
							/>
							{chat.unread > 0 && (
								<Box
									sx={{
										width: isMobile ? 16 : 20,
										height: isMobile ? 16 : 20,
										bgcolor: theme.palette.primary.main,
										color: theme.palette.primary
											.contrastText,
										borderRadius: '50%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: isMobile ? 10 : 12,
										fontWeight: 'bold',
										ml: 1,
									}}>
									{chat.unread}
								</Box>
							)}
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	)
}
