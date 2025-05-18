import { Outlet } from 'react-router-dom'

import Box from '@mui/material/Box'

import Main from './main'
import BasicHeader from './header'
import BasicFooter from './footer'
import ChatWidget from '../../components/chat/ChatWidget'
import { useSelector } from 'react-redux'
// ----------------------------------------------------------------------

export default function BasicLayout() {
	const { user } = useSelector((state) => state.auth)
	return (
		<>
			<BasicHeader />

			<Box
				sx={{
					minHeight: 1,
					display: 'flex',
					flexDirection: { xs: 'column', lg: 'row' },
				}}>
				<Main>
					<Outlet />
					{!user?.is_admin && <ChatWidget />}
				</Main>
			</Box>

			<BasicFooter />
		</>
	)
}
