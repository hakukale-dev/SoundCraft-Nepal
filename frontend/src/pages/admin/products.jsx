import { Helmet } from 'react-helmet';

import ProductsView from 'src/sections/admin/products';

// ----------------------------------------------------------------------

export default function AdminProductsPage() {
    return (
        <>
            <Helmet>
                <title> Products </title>
            </Helmet>

            <ProductsView />
        </>
    );
}
