import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Button, IconButton, Typography } from '@mui/material';

import { bgBlur } from 'src/theme/css';

import Logo from 'src/components/logo';

import navConfig from './config-navigation';
import AccountPopover from '../common/account-popover';
// import NotificationsPopover from '../common/notifications-popover';

function BasicHeader() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const theme = useTheme();
    const navigation = useNavigate();

    return (
        <AppBar
            sx={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                height: '100px',
                zIndex: theme.zIndex.appBar + 1,
                ...bgBlur({
                    color: '#FDF5E6',
                }),
                transition: theme.transitions.create(['height'], {
                    duration: theme.transitions.duration.shorter,
                }),
            }}
        >
            <Toolbar
                sx={{
                    height: 1,
                    px: { lg: 20 },
                    minHeight: '80px !important',
                }}
            >
                <IconButton 
                    onClick={() => navigation('/')}
                    sx={{ 
                        p: 0,
                        '&:hover': {
                            transform: 'scale(1.05)',
                            transition: 'transform 0.2s ease-in-out'
                        }
                    }}
                >
                    <Logo />
                </IconButton>

                <Stack
                    direction="row"
                    alignItems="center"
                    gap={3}
                    sx={{
                        marginLeft: 4,
                    }}
                >
                    {navConfig.map((page) => (
                        <Button
                            key={page.title}
                            onClick={() => navigation(page.path)}
                            sx={{ 
                                color: '#8B4513',
                                display: 'block',
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '1.1rem',
                                textTransform: 'none',
                                py: 2,
                                '&:hover': {
                                    color: '#654321',
                                    bgcolor: 'rgba(139, 69, 19, 0.1)',
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.2s ease-in-out'
                                }
                            }}
                        >
                            {page.title}
                        </Button>
                    ))}
                </Stack>

                <Box sx={{ flexGrow: 1 }} />

                {user && isAuthenticated ? (
                    <Stack direction="row" alignItems="center" spacing={4}>
                        {user.is_superuser && (
                            <Button 
                                variant="outlined" 
                                onClick={() => navigation('dashboard')}
                                sx={{
                                    color: '#8B4513',
                                    borderColor: '#8B4513',
                                    height: '48px',
                                    '&:hover': {
                                        borderColor: '#654321',
                                        bgcolor: 'rgba(139, 69, 19, 0.1)'
                                    }
                                }}
                            >
                                Dashboard
                            </Button>
                        )}
                        {/* <NotificationsPopover /> */}
                        <AccountPopover />
                    </Stack>
                ) : (
                    <Stack direction="row" spacing={2}>
                        <Button 
                            variant="outlined"
                            onClick={() => navigation('signup')}
                            sx={{
                                color: '#8B4513',
                                borderColor: '#8B4513',
                                height: '48px',
                                '&:hover': {
                                    borderColor: '#654321',
                                    bgcolor: 'rgba(139, 69, 19, 0.1)',
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.2s ease-in-out'
                                },
                                px: 3,
                                borderRadius: 2
                            }}
                        >
                            Sign Up
                        </Button>
                        <Button 
                            variant="contained"
                            onClick={() => navigation('login')}
                            sx={{
                                bgcolor: '#8B4513',
                                height: '48px',
                                '&:hover': { 
                                    bgcolor: '#654321',
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.2s ease-in-out'
                                },
                                px: 3,
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(139, 69, 19, 0.2)'
                            }}
                        >
                            Sign In
                        </Button>
                    </Stack>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default BasicHeader;
