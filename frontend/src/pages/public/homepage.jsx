import { Helmet } from 'react-helmet-async';

import HomepageView from 'src/sections/public/homepage';

// ----------------------------------------------------------------------

export default function HomePage() {
    return (
        <>
            <Helmet>
                <title> Homepage </title>
            </Helmet>

            <HomepageView />
        </>
    );
}
