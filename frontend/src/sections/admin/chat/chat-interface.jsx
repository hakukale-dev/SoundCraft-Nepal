import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography, TextField, Button, Avatar } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import axios from 'src/utils/axios'

export default function ChatInterface({ activeChat }) {
	const theme = useTheme()
	const { user } = useSelector((state) => state.auth)
	const [messages, setMessages] = useState([])
	const [newMessage, setNewMessage] = useState('')
	const messagesEndRef = useRef(null)

	const markMessagesAsRead = async () => {
		try {
			await axios.put('api/chat/mark-read')
		} catch (error) {
			console.error('Error marking messages as read:', error)
		}
	}

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const response = await axios.get('api/chat')
				const filteredMessages = response.data.filter(
					(message) =>
						message.isSupport ||
						message.sender._id === activeChat ||
						message.receiver._id === activeChat
				)
				setMessages(filteredMessages)
				if (activeChat) {
					await markMessagesAsRead()
				}
				scrollToBottom()
			} catch (error) {
				console.error('Error fetching messages:', error)
			}
		}

		if (activeChat) {
			fetchMessages()
			const interval = setInterval(fetchMessages, 1000)
			return () => clearInterval(interval)
		}
	}, [activeChat])

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const handleSendMessage = async () => {
		if (newMessage.trim() === '') return

		try {
			const response = await axios.post('api/chat', {
				message: newMessage,
				receiver: activeChat === 'support' ? null : activeChat,
				isSupport: activeChat === 'support',
			})
			setMessages([...messages, response.data])
			setNewMessage('')
		} catch (error) {
			console.error('Error sending message:', error)
		}
	}

	return (
		<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
			<Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
				{messages.map((message) => (
					<Box
						key={message._id}
						sx={{
							display: 'flex',
							flexDirection:
								message.sender._id === user._id
									? 'row-reverse'
									: 'row',
							mb: 2,
						}}>
						<Avatar
							sx={{ mx: 2 }}
							src={message.sender.photo}
							alt={`${message.sender.first_name} ${message.sender.last_name}`}>
							{message.sender.first_name.charAt(0).toUpperCase()}
						</Avatar>
						<Box
							sx={{
								p: 2,
								borderRadius: 2,
								bgcolor:
									message.sender._id === user._id
										? theme.palette.primary.light
										: theme.palette.grey[300],
								maxWidth: '70%',
							}}>
							<Typography variant="body1">
								{message.message}
							</Typography>
							<Typography
								variant="caption"
								sx={{ display: 'block', mt: 1 }}>
								{new Date(
									message.createdAt
								).toLocaleTimeString()}
							</Typography>
						</Box>
					</Box>
				))}
				<div ref={messagesEndRef} />
			</Box>

			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<TextField
					fullWidth
					variant="outlined"
					placeholder="Type a message..."
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
				/>
				<Button
					variant="contained"
					onClick={handleSendMessage}
					sx={{ ml: 2 }}>
					Send
				</Button>
			</Box>
		</Box>
	)
}
