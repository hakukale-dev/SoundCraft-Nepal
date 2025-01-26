import { Helmet } from 'react-helmet-async';

import SignupView from 'src/sections/auth/signup';

// ----------------------------------------------------------------------
export default function SignUpPage() {
    return (
        <>
            <Helmet>
                <title> Signup </title>
            </Helmet>

            <SignupView />
        </>
    );
}
