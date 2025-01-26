import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';

import BasicLayout from './basic';
import DashboardLayout from './dashboard';

export default function MainLayout({ user }) {
    return user.is_superuser ? (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    ) : (
        <BasicLayout>
            <Outlet />
        </BasicLayout>
    );
}

MainLayout.propTypes = {
    user: PropTypes.object,
};
