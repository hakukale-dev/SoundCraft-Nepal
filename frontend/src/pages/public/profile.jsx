import { Helmet } from 'react-helmet-async';

import ProfileView from 'src/sections/public/profile';

// ----------------------------------------------------------------------

export default function ProfilePage() {
    return (
        <>
            <Helmet>
                <title> Profile </title>
            </Helmet>

            <ProfileView />
        </>
    );
}
