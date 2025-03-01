import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useResponsive } from 'src/hooks/use-responsive';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import navConfig from './config-navigation';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
    const { user } = useSelector((state) => state.auth);
    const pathname = usePathname();
    const upLg = useResponsive('up', 'lg');

    useEffect(() => {
        if (!openNav) {
            onCloseNav();
        }
    }, [pathname, openNav, onCloseNav]);

    const AccountSection = () => (
        <Box
            sx={{
                my: 3,
                mx: 2.5,
                py: 2,
                px: 2.5,
                display: 'flex',
                borderRadius: 1.5,
                alignItems: 'center',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
            }}
        >
            <Avatar 
                src={user.photo} 
                alt={`${user.full_name}'s photo`}
                sx={{ width: 28, height: 28, mr: 2 }}
            />

            <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2">{user.first_name} {user.last_name}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {user.username}
                </Typography>
            </Box>
        </Box>
    );

    const NavigationMenu = () => (
        <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
            {navConfig.map((item) => (
                <NavItem key={item.title} item={item} />
            ))}
        </Stack>
    );

    const MainContent = () => (
        <Scrollbar
            sx={{
                height: 1,
                '& .simplebar-content': {
                    height: 1,
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <Logo sx={{ mt: 3, ml: 4 }} />
            <AccountSection />
            <NavigationMenu />
            <Box sx={{ flexGrow: 1 }} />
        </Scrollbar>
    );

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: { lg: 0 },
                width: { lg: NAV.WIDTH },
            }}
        >
            {upLg ? (
                <Box
                    sx={{
                        height: 1,
                        position: 'fixed',
                        width: NAV.WIDTH,
                        borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }}
                >
                    <MainContent />
                </Box>
            ) : (
                <Drawer
                    open={openNav}
                    onClose={onCloseNav}
                    ModalProps={{
                        onEscapeKeyDown: onCloseNav,
                        onKeyDown: onCloseNav,
                    }}
                    PaperProps={{
                        sx: {
                            width: NAV.WIDTH,
                        },
                    }}
                >
                    <MainContent />
                </Drawer>
            )}
        </Box>
    );
}

Nav.propTypes = {
    openNav: PropTypes.bool.isRequired,
    onCloseNav: PropTypes.func.isRequired,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
    const pathname = usePathname();
    const active = item.path === pathname;

    return (
        <ListItemButton
            component={RouterLink}
            href={item.path}
            sx={{
                minHeight: 44,
                borderRadius: 0.75,
                typography: 'body2',
                color: 'text.secondary',
                textTransform: 'capitalize',
                fontWeight: 'fontWeightMedium',
                ...(active && {
                    color: 'primary.main',
                    fontWeight: 'fontWeightSemiBold',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                    },
                }),
            }}
        >
            <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
                {item.icon}
            </Box>
            <Box component="span">{item.title}</Box>
        </ListItemButton>
    );
}

NavItem.propTypes = {
    item: PropTypes.shape({
        title: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        icon: PropTypes.node.isRequired
    }).isRequired,
};
