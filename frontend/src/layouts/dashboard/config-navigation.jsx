import { BarChart, Person, Inventory, Receipt, Hub } from '@mui/icons-material'

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
]

export default navConfig
