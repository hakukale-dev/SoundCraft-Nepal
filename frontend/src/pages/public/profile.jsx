import { Helmet } from 'react-helmet';

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
