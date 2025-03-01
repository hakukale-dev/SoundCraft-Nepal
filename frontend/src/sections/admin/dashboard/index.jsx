import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

import Container from '@mui/material/Container';
import { Grid, Typography } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';

import axiosInstance from 'src/utils/axios';

import AppTasks from './app-tasks';
// import AppNewsUpdate from './app-news-update';
// import AppOrderTimeline from './app-order-timeline';
import AppCurrentVisits from './app-current-visits';
import AppWebsiteVisits from './app-website-visits';
import AppWidgetSummary from './app-widget-summary';
// import AppTrafficBySite from './app-traffic-by-site';
// import AppCurrentSubject from './app-current-subject';
// import AppConversionRates from './app-conversion-rates';

// ----------------------------------------------------------------------

export default function DashboardView() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [details, setDetails] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        lowStockProducts: 0,
        stockLabels: [],
        stockData: [],
        categories: []
    });

    const fetchData = useCallback(async () => {
        axiosInstance(user.token)
            .get('api/admin/dashboard')
            .then((res) => {
                setDetails(res.data);
            })
            .catch(() => toast.error('Failed to fetch dashboard data'));
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return isAuthenticated ? (
        <Container maxWidth="xl">
            <Typography variant="h4" sx={{ mb: 5 }}>
                Hi, Welcome back 👋
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Total Products"
                        total={details.totalProducts || 0}
                        color="success"
                        icon={<ShoppingBagIcon />}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Total Users"
                        total={details.totalUsers || 0}
                        color="info"
                        icon={<PeopleIcon />}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Total Orders"
                        total={details.totalOrders || 0}
                        color="warning"
                        icon={<ShoppingCartIcon />}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Low Stock Products"
                        total={details.lowStockProducts || 0}
                        color="error"
                        icon={<InventoryIcon />}
                    />
                </Grid>

                <Grid item xs={12} md={6} lg={8}>
                    <AppWebsiteVisits
                        title="Product Stock Overview"
                        subheader="Current stock levels by category"
                        chart={{
                            labels: details.stockLabels || [],
                            series: [
                                {
                                    name: 'Stock Level',
                                    type: 'column',
                                    fill: 'solid',
                                    data: details.stockData || [],
                                }
                            ],
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                    <AppCurrentVisits
                        title="Product Categories"
                        chart={{
                            series: details.categoriesWithCount || [],
                        }}
                    />
                </Grid>

                {/* <Grid item xs={12} md={6} lg={8}>
                    <AppNewsUpdate
                        title="Recent Products"
                        list={details.recentProducts || []}
                    />
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                    <AppOrderTimeline
                        title="Recent Users"
                        list={details.recentUsers || []}
                    />
                </Grid> */}

                {/* <Grid item xs={12} md={6} lg={4}>
                    <AppTrafficBySite
                        title="Product Categories"
                        list={details.categories || []}
                    />
                </Grid> */}

                <Grid item xs={12} md={6} lg={8}>
                    <AppTasks
                        title="Tasks"
                        list={[
                            { id: '1', name: 'Update Product Inventory' },
                            { id: '2', name: 'Review New User Registrations' },
                            { id: '3', name: 'Check Low Stock Alerts' },
                            { id: '4', name: 'Update Product Descriptions' },
                            { id: '5', name: 'Backup Database' },
                        ]}
                    />
                </Grid>
            </Grid>
        </Container>
    ) : (
        <Navigate to="/login" />
    );
}
