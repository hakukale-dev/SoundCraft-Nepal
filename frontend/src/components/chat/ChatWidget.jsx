import React, { useState, useEffect, useRef } from 'react'
import {
	Box,
	Avatar,
	TextField,
	IconButton,
	Badge,
	Typography,
	Paper,
	Stack,
	Divider,
} from '@mui/material'
import { Send, Chat as ChatIcon, Close } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import axios from 'src/utils/axios'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'

const ChatWidget = () => {
	const theme = useTheme()
	const { user } = useSelector((state) => state.auth)
	const [messages, setMessages] = useState([])
	const [newMessage, setNewMessage] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [unreadCount, setUnreadCount] = useState(0)
	const messagesEndRef = useRef(null)

	useEffect(() => {
		if (isOpen) {
			fetchMessages()
			markMessagesAsRead()
			const interval = setInterval(fetchMessages, 1000)
			return () => clearInterval(interval)
		}
	}, [isOpen])

	const fetchMessages = async () => {
		try {
			const { data } = await axios.get('/api/chat')
			setMessages(data)

			const count = data.filter(
				(msg) => !msg.isRead && msg.receiver?._id === user?._id
			).length
			setUnreadCount(count)
		} catch (error) {
			console.error('Error fetching messages:', error)
		}
	}

	const markMessagesAsRead = async () => {
		try {
			await axios.put('/api/chat/mark-read')
			setUnreadCount(0)
		} catch (error) {
			console.error('Error marking messages as read:', error)
		}
	}

	const handleSendMessage = async () => {
		if (!newMessage.trim()) return

		try {
			await axios.post('/api/chat', {
				message: newMessage,
				isSupport: true,
			})
			setNewMessage('')
			fetchMessages()
		} catch (error) {
			console.error('Error sending message:', error)
		}
	}

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	return (
		<Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
			<IconButton
				onClick={() => setIsOpen(!isOpen)}
				sx={{
					p: 2,
					bgcolor: theme.palette.primary.main,
					color: 'white',
					'&:hover': {
						bgcolor: theme.palette.primary.dark,
					},
				}}>
				<Badge
					badgeContent={unreadCount}
					color="error">
					<ChatIcon />
				</Badge>
			</IconButton>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.2 }}>
						<Paper
							sx={{
								width: 350,
								height: 500,
								display: 'flex',
								flexDirection: 'column',
								position: 'absolute',
								bottom: 60,
								right: 0,
								overflow: 'hidden',
							}}>
							<Box
								sx={{
									p: 2,
									bgcolor: theme.palette.primary.main,
									color: 'white',
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}>
								<Typography variant="h6">
									Customer Support
								</Typography>
								<IconButton
									size="small"
									color="inherit"
									onClick={() => setIsOpen(false)}>
									<Close fontSize="small" />
								</IconButton>
							</Box>

							<Box
								sx={{
									flex: 1,
									p: 2,
									overflowY: 'auto',
									bgcolor: theme.palette.background.paper,
								}}>
								{messages.map((message) => (
									<Stack
										key={message._id}
										direction={
											message.sender._id === user?._id
												? 'row-reverse'
												: 'row'
										}
										spacing={1}
										sx={{ mb: 2 }}>
										<Avatar
											src={message.sender.photo}
											sx={{ width: 32, height: 32 }}
										/>
										<Box
											sx={{
												maxWidth: '70%',
												p: 1.5,
												borderRadius: 2,
												bgcolor:
													message.sender._id ===
													user?._id
														? theme.palette.primary
																.lighter
														: theme.palette
																.grey[200],
												color: theme.palette.text
													.primary,
											}}>
											<Typography variant="body2">
												{message.message}
											</Typography>
											<Typography
												variant="caption"
												sx={{
													display: 'block',
													textAlign: 'right',
													color: theme.palette.text
														.secondary,
												}}>
												{new Date(
													message.createdAt
												).toLocaleTimeString([], {
													hour: '2-digit',
													minute: '2-digit',
												})}
											</Typography>
										</Box>
									</Stack>
								))}
								<div ref={messagesEndRef} />
							</Box>

							<Divider />

							<Box sx={{ p: 2 }}>
								<Stack
									direction="row"
									spacing={1}>
									<TextField
										fullWidth
										size="small"
										value={newMessage}
										onChange={(e) =>
											setNewMessage(e.target.value)
										}
										placeholder="Type your message..."
										onKeyPress={(e) => {
											if (e.key === 'Enter')
												handleSendMessage()
										}}
									/>
									<IconButton
										color="primary"
										onClick={handleSendMessage}
										disabled={!newMessage.trim()}>
										<Send />
									</IconButton>
								</Stack>
							</Box>
						</Paper>
					</motion.div>
				)}
			</AnimatePresence>
		</Box>
	)
}

export default ChatWidget
