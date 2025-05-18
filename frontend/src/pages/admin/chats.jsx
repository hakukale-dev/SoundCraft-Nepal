import { Helmet } from 'react-helmet-async'

import AdminChatView from 'src/sections/admin/chat'

export default function AdminChatsPage() {
	return (
		<>
			<Helmet>
				<title> Admin | Chats </title>
			</Helmet>

			<AdminChatView />
		</>
	)
}
