import {
	BarChart,
	Person,
	Inventory,
	Receipt,
	Hub,
	Chat,
	Inventory2,
} from '@mui/icons-material'

// ----------------------------------------------------------------------

const navConfig = [
	{
		title: 'dashboard',
		path: '/admin/dashboard',
		icon: <BarChart />,
	},
	{
		title: 'users',
		path: '/admin/users',
		icon: <Person />,
	},
	{
		title: 'products',
		path: '/admin/products',
		icon: <Inventory />,
	},
	{
		title: 'learning articles',
		path: '/admin/learning-hub',
		icon: <Hub />,
	},
	{
		title: 'orders',
		path: '/admin/orders',
		icon: <Inventory2 />,
	},
	{
		title: 'chat',
		path: '/admin/chat',
		icon: <Chat />,
	},
	{
		title: 'queries',
		path: '/admin/queries',
		icon: <Receipt />,
	},
]

export default navConfig
