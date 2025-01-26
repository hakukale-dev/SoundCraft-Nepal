import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { MusicNote } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';
import { bgGradient } from 'src/theme/css';
import { Stack } from '@mui/material';

export default function NotFoundView() {
    return (
        <Box
            sx={{
                height: 1,
            }}
        >
            <Container>
                <Box
                    sx={{
                        py: 12,
                        maxWidth: 480,
                        mx: 'auto',
                        display: 'flex',
                        minHeight: '100vh',
                        textAlign: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 5 }}>
                        <MusicNote sx={{ color: '#8B4513', fontSize: '2rem' }} />
                        <Typography
                            variant="h3"
                            sx={{
                                color: '#8B4513',
                                fontFamily: "'Playfair Display', serif",
                                mb: 3
                            }}
                        >
                            Page Not Found
                        </Typography>
                        <MusicNote sx={{ color: '#8B4513', fontSize: '2rem' }} />
                    </Stack>

                    <Typography sx={{ color: '#8B4513' }}>
                        Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the
                        URL? Be sure to check your spelling.
                    </Typography>

                    <Typography
                        variant="h1"
                        sx={{
                            fontWeight: 800,
                            color: '#8B4513',
                            fontSize: '10rem',
                            my: { xs: 5, sm: 10 },
                        }}
                    >
                        404
                    </Typography>

                    <Button 
                        href="/" 
                        size="large" 
                        variant="contained"
                        component={RouterLink}
                        sx={{
                            bgcolor: '#8B4513',
                            '&:hover': {
                                bgcolor: '#654321',
                            },
                        }}
                    >
                        Back to Homepage
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
