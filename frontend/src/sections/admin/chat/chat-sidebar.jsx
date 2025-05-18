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

export default function ChatSidebar({ activeChat, setActiveChat, chats }) {
	const theme = useTheme()

	return (
		<Box
			sx={{
				width: '100%',
				height: '100%',
				borderRight: `1px solid ${theme.palette.divider}`,
			}}>
			<Box
				sx={{
					p: 2,
					borderBottom: `1px solid ${theme.palette.divider}`,
				}}>
				<Typography variant="h6">Chats</Typography>
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
						<ListItemButton>
							<ListItemText
								primary={chat.name}
								secondary={chat.lastMessage}
								primaryTypographyProps={{
									fontWeight:
										chat.unread > 0 ? 'bold' : 'normal',
								}}
								secondaryTypographyProps={{
									color:
										chat.unread > 0
											? 'text.primary'
											: 'text.secondary',
								}}
							/>
							{chat.unread > 0 && (
								<Box
									sx={{
										width: 20,
										height: 20,
										bgcolor: theme.palette.primary.main,
										color: theme.palette.primary
											.contrastText,
										borderRadius: '50%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 12,
										fontWeight: 'bold',
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
