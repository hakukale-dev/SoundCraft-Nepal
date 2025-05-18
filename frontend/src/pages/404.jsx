import { Helmet } from 'react-helmet';

import NotFoundView from 'src/sections/error/404';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
    return (
        <>
            <Helmet>
                <title> Page Not Found </title>
            </Helmet>

            <NotFoundView />
        </>
    );
}
