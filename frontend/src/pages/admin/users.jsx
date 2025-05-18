import { Helmet } from 'react-helmet';

import UserView from 'src/sections/admin/user';

// ----------------------------------------------------------------------

export default function UserPage() {
    return (
        <>
            <Helmet>
                <title> Users </title>
            </Helmet>

            <UserView />
        </>
    );
}
