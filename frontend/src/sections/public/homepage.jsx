import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Card,
    Grid,
    Stack,
    Button,
    CardMedia,
    Container,
    Typography,
    CardContent,
    Box,
} from '@mui/material';

const categories = {
    'Electric Guitars': 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fimages5.fanpop.com%2Fimage%2Fphotos%2F27300000%2FLes-Paul-guitar-27367484-1920-1200.jpg&f=1&nofb=1&ipt=97502988971c35c5c38e9c18f348d79f49c8cbc327db9a431762f02bdf8362c7&ipo=images',
    'Acoustic Guitars': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.wallpapersafari.com%2F34%2F23%2FucRNav.jpg&f=1&nofb=1&ipt=701d1fc5fb87acf9c6a73a38e78e43c052f87c776527bfa893bddddef28fdda7&ipo=images',
    'Bass Guitars': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.talkbass.com%2Fattachments%2Fwyn-97-pic-jpeg.661004%2F&f=1&nofb=1&ipt=d60661418dcf0e95640e17a51882473b46008f927726fad0d03ea52270b5ebd0&ipo=images',
};

function HomepageView() {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <Typography variant="h3" gutterBottom sx={{ fontFamily: "'Playfair Display', serif", color: '#2C3E50' }}>
                            Discover Your Perfect Sound at GuitarHub
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ color: '#34495E', fontSize: '1.1rem', lineHeight: 1.8 }}>
                            Welcome to GuitarHub, your premier destination for quality guitars and musical equipment.
                            From vintage acoustics to modern electric guitars, we offer a carefully curated selection
                            of instruments for players of all skill levels. Our expert staff is here to help you find
                            the perfect instrument to match your style and sound.
                        </Typography>
                        <Button 
                            variant="contained" 
                            size="large" 
                            sx={{
                                bgcolor: '#8B4513',
                                '&:hover': { bgcolor: '#654321' },
                                px: 4,
                                py: 1.5,
                                borderRadius: 2
                            }}
                        >
                            Explore Guitars
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        bgcolor: '#FDF5E6'
                    }}>
                        <CardMedia
                            component="img"
                            image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2F7CHUvpx.jpg&f=1&nofb=1&ipt=652940ba0a656c3b5863be61f431ad69d003bd570e85c6d659b932e2db750189&ipo=images"
                            alt="Featured Guitar"
                            sx={{ width: '100%', height: 400, objectFit: 'cover' }}
                        />
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                            <Stack direction="column" spacing={2}>
                                <Typography variant="h5" gutterBottom sx={{ color: '#8B4513', fontWeight: 600 }}>
                                    New Arrival Special!
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#34495E' }}>
                                    Get 15% off on all Gibson guitars this month. Plus, free setup and first maintenance included!
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    sx={{ 
                                        color: '#8B4513', 
                                        borderColor: '#8B4513',
                                        '&:hover': { 
                                            borderColor: '#654321',
                                            bgcolor: 'rgba(139, 69, 19, 0.1)'
                                        }
                                    }}
                                >
                                    View Special Offers
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={4} sx={{ mt: 6 }}>
                {/* Featured Categories */}
                {Object.keys(categories).map((category) => (
                    <Grid item xs={12} sm={6} md={4} key={category}>
                        <Card sx={{ 
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': { transform: 'translateY(-8px)' },
                            height: '100%', // Make all cards same height
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Box sx={{ pt: '100%', position: 'relative' }}> {/* Create 1:1 aspect ratio container */}
                                <CardMedia
                                    component="img"
                                    image={categories[category]}
                                    alt={category}
                                    sx={{ 
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </Box>
                            <CardContent sx={{ 
                                bgcolor: '#FDF5E6', 
                                p: 3,
                                flexGrow: 1, // Allow content to fill remaining space
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <Typography variant="h6" gutterBottom sx={{ color: '#8B4513', fontWeight: 600 }}>
                                    {category}
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="medium"
                                    sx={{
                                        bgcolor: '#8B4513',
                                        '&:hover': { bgcolor: '#654321' },
                                        width: '100%'
                                    }}
                                >
                                    Browse {category}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default HomepageView;
