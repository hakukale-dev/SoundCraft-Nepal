import { Helmet } from 'react-helmet-async';

import ProductsView from 'src/sections/public/products';

// ----------------------------------------------------------------------

export default function ProductsPage() {
    return (
        <>
            <Helmet>
                <title> Products </title>
            </Helmet>

            <ProductsView />
        </>
    );
}
