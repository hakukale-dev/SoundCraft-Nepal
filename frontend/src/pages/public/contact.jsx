import { Helmet } from 'react-helmet-async';

import ContactView from 'src/sections/public/contact-us';

// ----------------------------------------------------------------------

export default function ContactPage() {
    return (
        <>
            <Helmet>
                <title> Contact </title>
            </Helmet>

            <ContactView />
        </>
    );
}
