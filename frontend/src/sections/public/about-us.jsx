import React from 'react';

import { Box, Grid, Avatar, Container, Typography, Stack } from '@mui/material';
import { MusicNote } from '@mui/icons-material';

export default function AboutUsView() {
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
                                <MusicNote sx={{ color: '#8B4513', fontSize: 40 }} />
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontFamily: "'Playfair Display', serif",
                                        color: '#8B4513'
                                    }}
                                >
                                    About Our Shop
                                </Typography>
                            </Box>
                            <Typography
                                variant="body1"
                                paragraph
                                sx={{
                                    color: '#654321',
                                    fontSize: '1.1rem',
                                    lineHeight: 1.8
                                }}
                            >
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est, ab! Sit velit ea magni nesciunt nulla
                                iste, et omnis incidunt quidem optio nemo. Quisquam amet temporibus, fugiat facere asperiores eveniet.
                            </Typography>
                            <Typography
                                variant="body1"
                                paragraph
                                sx={{
                                    color: '#654321',
                                    fontSize: '1.1rem',
                                    lineHeight: 1.8
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
                                    bgcolor: 'white',
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(139, 69, 19, 0.1)'
                                }}
                            >
                                <Stack direction="row" spacing={3} alignItems="center">
                                    <Avatar
                                        alt="Master Craftsman"
                                        src="/assets/images/craftsman.jpg"
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            border: '3px solid #8B4513'
                                        }}
                                    />
                                    <Stack spacing={2}>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontFamily: "'Playfair Display', serif",
                                                color: '#8B4513'
                                            }}
                                        >
                                            Our Craftsmen
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: '#654321',
                                                lineHeight: 1.6
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