import { Helmet } from 'react-helmet-async';

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
