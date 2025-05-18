import { Helmet } from 'react-helmet';

import LoginView from 'src/sections/auth/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
    return (
        <>
            <Helmet>
                <title> Login </title>
            </Helmet>

            <LoginView />
        </>
    );
}
