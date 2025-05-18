import { Helmet } from 'react-helmet';

import DashboardView from 'src/sections/admin/dashboard';

// ----------------------------------------------------------------------

export default function DashboardPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard </title>
            </Helmet>

            <DashboardView />
        </>
    );
}
