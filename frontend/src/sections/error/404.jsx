import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { MusicNote } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';
import { Stack } from '@mui/material';

export default function NotFoundView() {
    const theme = useTheme();

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
                        <MusicNote sx={{ color: theme.palette.primary.main, fontSize: '2rem' }} />
                        <Typography
                            variant="h3"
                            sx={{
                                color: theme.palette.primary.main,
                                fontFamily: theme.typography.fontFamily,
                                mb: 3
                            }}
                        >
                            Page Not Found
                        </Typography>
                        <MusicNote sx={{ color: theme.palette.primary.main, fontSize: '2rem' }} />
                    </Stack>

                    <Typography sx={{ color: theme.palette.primary.main }}>
                        Sorry, we couldn&apos;t find the page you&apos;re looking for. Perhaps you&apos;ve mistyped the
                        URL? Be sure to check your spelling.
                    </Typography>

                    <Typography
                        variant="h1"
                        sx={{
                            fontWeight: 800,
                            color: theme.palette.primary.main,
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
                            bgcolor: theme.palette.primary.main,
                            '&:hover': {
                                bgcolor: theme.palette.primary.dark,
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
