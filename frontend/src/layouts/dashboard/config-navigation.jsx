import { BarChart, Person, Inventory, Receipt } from '@mui/icons-material'

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
		title: 'billing history',
		path: '/admin/billing-history',
		icon: <Receipt />,
	},
]

export default navConfig
