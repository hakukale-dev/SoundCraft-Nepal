import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import { Link, Stack, Container, Typography } from '@mui/material';
import { Twitter, Facebook, Instagram, Copyright, MusicNote } from '@mui/icons-material';

const BasicFooter = () => {
    const theme = useTheme();

    return (
        <Container
            sx={{
                padding: 4,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderTop: `1px solid ${theme.palette.divider}`,
            }}
            maxWidth
        >
            <Stack gap={4} alignItems="center">
                <Stack gap={4} direction="row" textAlign="center" justifyContent="center">
                    <Link 
                        underline="hover" 
                        component={RouterLink} 
                        to="/"
                        sx={{
                            color: theme.palette.text.primary,
                            fontSize: '1.1rem',
                            fontFamily: theme.typography.fontFamily,
                            '&:hover': {
                                color: theme.palette.primary.main,
                            }
                        }}
                    >
                        Home
                    </Link>
                    <Link 
                        underline="hover" 
                        component={RouterLink} 
                        to="/contact"
                        sx={{
                            color: theme.palette.text.primary,
                            fontSize: '1.1rem',
                            fontFamily: theme.typography.fontFamily,
                            '&:hover': {
                                color: theme.palette.primary.main,
                            }
                        }}
                    >
                        Contact Us
                    </Link>
                    <Link 
                        underline="hover" 
                        component={RouterLink} 
                        to="/products"
                        sx={{
                            color: theme.palette.text.primary,
                            fontSize: '1.1rem',
                            fontFamily: theme.typography.fontFamily,
                            '&:hover': {
                                color: theme.palette.primary.main,
                            }
                        }}
                    >
                        Explore Products
                    </Link>
                </Stack>

                <Stack gap={3} direction="row" textAlign="center" justifyContent="center">
                    <Link 
                        href="#" 
                        sx={{ 
                            color: theme.palette.text.primary,
                            '&:hover': {
                                color: theme.palette.primary.main,
                                transform: 'translateY(-2px)',
                                transition: 'all 0.2s ease-in-out'
                            }
                        }}
                    >
                        <Instagram fontSize="large" />
                    </Link>
                    <Link 
                        href="#" 
                        sx={{ 
                            color: theme.palette.text.primary,
                            '&:hover': {
                                color: theme.palette.primary.main,
                                transform: 'translateY(-2px)',
                                transition: 'all 0.2s ease-in-out'
                            }
                        }}
                    >
                        <Facebook fontSize="large" />
                    </Link>
                    <Link 
                        href="#" 
                        sx={{ 
                            color: theme.palette.text.primary,
                            '&:hover': {
                                color: theme.palette.primary.main,
                                transform: 'translateY(-2px)',
                                transition: 'all 0.2s ease-in-out'
                            }
                        }}
                    >
                        <Twitter fontSize="large" />
                    </Link>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                    <MusicNote sx={{ fontSize: '1rem' }} />
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            fontFamily: theme.typography.fontFamily,
                            fontSize: '0.9rem'
                        }}
                    >
                        Crafting Musical Memories Since 2025
                    </Typography>
                    <MusicNote sx={{ fontSize: '1rem' }} />
                </Stack>

                <Typography 
                    variant="caption" 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 0.5,
                        opacity: 0.8
                    }}
                >
                    <Copyright sx={{ fontSize: '1rem' }} />
                    2025 G-Shop. All rights reserved.
                </Typography>
            </Stack>
        </Container>
    );
};

export default BasicFooter;
