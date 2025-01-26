import {
    BarChart,
    Person,
    Inventory,
} from '@mui/icons-material';

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
];

export default navConfig;
