import { Link as RouterLink } from 'react-router-dom';

import { Link, Stack, Container, Typography } from '@mui/material';
import { Twitter, Facebook, Instagram, Copyright, MusicNote } from '@mui/icons-material';

const BasicFooter = () => (
    <Container
        sx={{
            padding: 4,
            backgroundColor: '#FDF5E6',
            color: '#8B4513',
            borderTop: '1px solid rgba(139, 69, 19, 0.2)',
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
                        color: '#8B4513',
                        fontSize: '1.1rem',
                        fontFamily: "'Playfair Display', serif",
                        '&:hover': {
                            color: '#654321',
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
                        color: '#8B4513',
                        fontSize: '1.1rem',
                        fontFamily: "'Playfair Display', serif",
                        '&:hover': {
                            color: '#654321',
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
                        color: '#8B4513',
                        fontSize: '1.1rem',
                        fontFamily: "'Playfair Display', serif",
                        '&:hover': {
                            color: '#654321',
                        }
                    }}
                >
                    Our Guitars
                </Link>
            </Stack>

            <Stack gap={3} direction="row" textAlign="center" justifyContent="center">
                <Link 
                    href="#" 
                    sx={{ 
                        color: '#8B4513',
                        '&:hover': {
                            color: '#654321',
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
                        color: '#8B4513',
                        '&:hover': {
                            color: '#654321',
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
                        color: '#8B4513',
                        '&:hover': {
                            color: '#654321',
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
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '0.9rem'
                    }}
                >
                    Crafting Musical Memories Since 1990
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
                2023 Harmony Guitar Shop. All rights reserved.
            </Typography>
        </Stack>
    </Container>
);

export default BasicFooter;
