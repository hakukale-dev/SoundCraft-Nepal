import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    Stack,
    Typography,
    Container,
    CardMedia,
    CardContent,
    CircularProgress,
} from '@mui/material';
import axiosInstance from 'src/utils/axios';

export default function ProductsView() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance().get('api/products');
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
                <CircularProgress sx={{ color: '#8B4513' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: '100px' }}>
                <Typography variant="h6" color="error" align="center" fontFamily="'Playfair Display', serif">
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: '120px', px: { lg: 20 } }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography 
                    variant="h4" 
                    fontFamily="'Playfair Display', serif"
                    color="#8B4513"
                    sx={{
                        fontSize: '2.5rem',
                        fontWeight: 600,
                    }}
                >
                    Our Musical Instruments
                </Typography>
            </Stack>

            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid key={product._id} item xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ 
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s ease-in-out',
                            borderRadius: 2,
                            bgcolor: '#FDF5E6',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 12px 24px rgba(139, 69, 19, 0.15)',
                            },
                        }}>
                            <CardMedia
                                component="img"
                                height="240"
                                image={product.image || '/assets/images/placeholder.png'}
                                alt={product.name}
                                sx={{ 
                                    objectFit: 'cover',
                                    borderBottom: '1px solid rgba(139, 69, 19, 0.1)'
                                }}
                            />
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                <Typography 
                                    gutterBottom 
                                    variant="h6" 
                                    component="div"
                                    fontFamily="'Playfair Display', serif"
                                    color="#8B4513"
                                    sx={{ fontSize: '1.25rem', fontWeight: 600 }}
                                >
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={1} sx={{ fontFamily: "'Playfair Display', serif" }}>
                                    Model: {product.model}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={2} sx={{ fontFamily: "'Playfair Display', serif" }}>
                                    Category: {product.category}
                                </Typography>
                                <Typography 
                                    variant="h6" 
                                    color="#8B4513"
                                    sx={{ 
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: '1.5rem',
                                        fontWeight: 600 
                                    }}
                                >
                                    ${product.price}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{
                                        color: product.stock > 0 ? '#2E7D32' : '#C62828',
                                        fontFamily: "'Playfair Display', serif",
                                        mt: 1,
                                        fontWeight: 500
                                    }}
                                >
                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}