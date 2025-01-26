import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Button, CardMedia, CardActions, CardContent, CardActionArea } from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function ShopProductCard({ product }) {
    const navigate = useNavigate();

    const renderPrice = (
        <Typography variant="subtitle1">Rs. {fCurrency(product.price_per)}</Typography>
    );

    const showProduct = () => navigate('/product-detail', { state: { product } });

    return (
        <Card>
            <CardActionArea disableRipple onClick={showProduct}>
                <CardMedia
                    component="img"
                    height="140"
                    image={product.thumbnail}
                    alt={product.name}
                />
                <CardContent>
                    <Typography variant="h5" component="div">
                        {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {renderPrice}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Button size="small" color="primary" onClick={showProduct}>
                    See More
                </Button>
            </CardActions>
        </Card>
    );
}

ShopProductCard.propTypes = {
    product: PropTypes.object,
};
