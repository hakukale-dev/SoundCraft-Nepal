import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Box, Container, Typography, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Navigate } from 'react-router-dom'
import useMediaQuery from '@mui/material/useMediaQuery'
import ChatSidebar from './chat-sidebar'
import ChatInterface from './chat-interface'
import axios from 'src/utils/axios'

export default function AdminChatView() {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const { user, isAuthenticated, is_admin } = useSelector(
		(state) => state.auth
	)
	const [activeChat, setActiveChat] = useState(null)
	const [chats, setChats] = useState([])
	const [loading, setLoading] = useState(true)
	const [showSidebar, setShowSidebar] = useState(true)

	useEffect(() => {
		const fetchChats = async () => {
			try {
				const response = await axios.get('api/chat')
				const uniqueChats = response.data.reduce((acc, message) => {
					const chatId = message.isSupport
						? 'support'
						: message.sender._id === user._id
						? message.receiver._id
						: message.sender._id
					if (!acc.some((c) => c.id === chatId)) {
						acc.push({
							id: chatId,
							name: message.isSupport
								? 'Support Chat'
								: message.sender._id === user._id
								? `${message.receiver.first_name} ${message.receiver.last_name}`
								: `${message.sender.first_name} ${message.sender.last_name}`,
							lastMessage: message.message,
							unread: message.isRead ? 0 : 1,
						})
					}
					return acc
				}, [])
				setChats(uniqueChats)
				if (uniqueChats.length > 0 && !activeChat) {
					setActiveChat(uniqueChats[0].id)
					if (isMobile) setShowSidebar(false)
				}
			} catch (error) {
				console.error('Error fetching chats:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchChats()
	}, [user._id, activeChat, isMobile])

	if (!isAuthenticated || !is_admin) {
		return (
			<Navigate
				to="/"
				replace
			/>
		)
	}

	return (
		<Container
			maxWidth="xl"
			sx={{ px: isMobile ? 1 : 3 }}>
			<Stack
				spacing={3}
				sx={{ py: isMobile ? 2 : 5 }}>
				<Typography
					variant={isMobile ? 'h5' : 'h4'}
					color={theme.palette.primary.main}>
					Admin Chat Dashboard
				</Typography>

				<Box
					sx={{
						height: isMobile ? 'calc(100vh - 120px)' : '70vh',
						border: `1px solid ${theme.palette.divider}`,
						borderRadius: 1,
						p: isMobile ? 1 : 3,
						backgroundColor: theme.palette.background.paper,
						display: 'flex',
						flexDirection: isMobile ? 'column' : 'row',
					}}>
					{loading ? (
						<Box
							sx={{
								width: '100%',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<Typography>Loading chats...</Typography>
						</Box>
					) : chats.length === 0 ? (
						<Box
							sx={{
								width: '100%',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<Typography>No chats available</Typography>
						</Box>
					) : (
						<>
							{(!isMobile || showSidebar) && (
								<Box
									sx={{
										width: isMobile ? '100%' : '30%',
										height: isMobile ? '40%' : '100%',
										display:
											isMobile && !showSidebar
												? 'none'
												: 'block',
									}}>
									<ChatSidebar
										activeChat={activeChat}
										setActiveChat={setActiveChat}
										chats={chats}
										onChatSelect={() =>
											isMobile && setShowSidebar(false)
										}
									/>
								</Box>
							)}
							{(!isMobile || !showSidebar) && (
								<Box
									sx={{
										width: isMobile ? '100%' : '70%',
										height: isMobile ? '60%' : '100%',
										pl: isMobile ? 0 : 3,
										pt: isMobile ? 2 : 0,
									}}>
									<ChatInterface
										activeChat={activeChat}
										onBack={() =>
											isMobile && setShowSidebar(true)
										}
									/>
								</Box>
							)}
						</>
					)}
				</Box>
			</Stack>
		</Container>
	)
}
