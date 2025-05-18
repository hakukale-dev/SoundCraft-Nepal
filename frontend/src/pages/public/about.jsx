import { Helmet } from 'react-helmet';

import AboutUsView from 'src/sections/public/about-us';

// ----------------------------------------------------------------------

export default function AboutUsPage()
{
    return (
        <>
            <Helmet>
                <title> About </title>
            </Helmet>

            <AboutUsView />
        </>
    );
}
