import { Helmet } from 'react-helmet';

import ForgotPasswordView from 'src/sections/auth/forgot-password';

// ----------------------------------------------------------------------
export default function ForgotPasswordPage() {
    return (
        <>
            <Helmet>
                <title> Forgot Password </title>
            </Helmet>

            <ForgotPasswordView />
        </>
    );
}
