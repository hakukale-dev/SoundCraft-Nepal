import { Box, Grid, Avatar, Container, Typography, Stack } from '@mui/material';
import { MusicNote } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

export default function AboutUsView() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 100px)', // Match navbar height
                pt: 8,
                pb: 6
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={5} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <MusicNote sx={{ color: theme.palette.primary.main, fontSize: 40 }} />
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontFamily: theme.typography.fontFamily,
                                        color: theme.palette.primary.main
                                    }}
                                >
                                    About Our Shop
                                </Typography>
                            </Box>
                            <Typography
                                variant="body1"
                                paragraph
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontSize: '1.1rem',
                                    lineHeight: 1.8,
                                    fontFamily: theme.typography.fontFamily
                                }}
                            >
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est, ab! Sit velit ea magni nesciunt nulla
                                iste, et omnis incidunt quidem optio nemo. Quisquam amet temporibus, fugiat facere asperiores eveniet.
                            </Typography>
                            <Typography
                                variant="body1"
                                paragraph
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontSize: '1.1rem',
                                    lineHeight: 1.8,
                                    fontFamily: theme.typography.fontFamily
                                }}
                            >
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est, ab! Sit velit ea magni nesciunt nulla
                                iste, et omnis incidunt quidem optio nemo. Quisquam amet temporibus, fugiat facere asperiores eveniet.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item container xs={12} md={6} spacing={4}>
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    p: 4,
                                    bgcolor: theme.palette.background.paper,
                                    borderRadius: 2,
                                    boxShadow: theme.shadows[2]
                                }}
                            >
                                <Stack direction="row" spacing={3} alignItems="center">
                                    <Avatar
                                        alt="Master Craftsman"
                                        src="/assets/images/craftsman.jpg"
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            border: `3px solid ${theme.palette.primary.main}`
                                        }}
                                    />
                                    <Stack spacing={2}>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontFamily: theme.typography.fontFamily,
                                                color: theme.palette.primary.main
                                            }}
                                        >
                                            Our Craftsmen
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: theme.palette.text.primary,
                                                lineHeight: 1.6,
                                                fontFamily: theme.typography.fontFamily
                                            }}
                                        >
                                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est, ab! Sit velit ea magni nesciunt nulla
                                            iste, et omnis incidunt quidem optio nemo. Quisquam amet temporibus, fugiat facere asperiores eveniet.
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}