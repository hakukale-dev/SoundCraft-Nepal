import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import Container from '@mui/material/Container'
import { Grid, Typography } from '@mui/material'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import PeopleIcon from '@mui/icons-material/People'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import InventoryIcon from '@mui/icons-material/Inventory'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import SchoolIcon from '@mui/icons-material/School'
import StarIcon from '@mui/icons-material/Star'

import axios from 'src/utils/axios'

import AppTasks from './app-tasks'
import AppNewsUpdate from './app-news-update'
import AppOrderTimeline from './app-order-timeline'
import AppCurrentVisits from './app-current-visits'
import AppWebsiteVisits from './app-website-visits'
import AppWidgetSummary from './app-widget-summary'

// ----------------------------------------------------------------------

export default function DashboardView() {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const { user, isAuthenticated } = useSelector((state) => state.auth)

	const [details, setDetails] = useState({
		totalUsers: 0,
		totalProducts: 0,
		totalOrders: 0,
		totalRevenue: 0,
		totalLessons: 0,
		averageRating: 0,
		lowStockProducts: 0,
		stockLabels: [],
		stockData: [],
		categoriesWithCount: [],
		recentOrders: [],
		recentReviews: [],
		recentLessons: [],
	})

	const fetchData = useCallback(async () => {
		axios
			.get('api/admin/dashboard')
			.then((res) => {
				setDetails(res.data)
			})
			.catch(() => toast.error('Failed to fetch dashboard data'))
	}, [user])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	return isAuthenticated ? (
		<Container
			maxWidth="xl"
			sx={{ px: isMobile ? 1 : 3 }}>
			<Typography
				variant={isMobile ? 'h5' : 'h4'}
				sx={{ mb: isMobile ? 3 : 5 }}>
				Hi, Welcome back 👋
			</Typography>

			<Grid
				container
				spacing={isMobile ? 2 : 3}>
				<Grid
					item
					xs={12}
					sm={6}
					md={3}>
					<AppWidgetSummary
						title="Total Products"
						total={details.totalProducts || 0}
						color="success"
						icon={<ShoppingBagIcon />}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={3}>
					<AppWidgetSummary
						title="Total Users"
						total={details.totalUsers || 0}
						color="info"
						icon={<PeopleIcon />}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={3}>
					<AppWidgetSummary
						title="Total Orders"
						total={details.totalOrders || 0}
						color="warning"
						icon={<ShoppingCartIcon />}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={3}>
					<AppWidgetSummary
						title="Total Revenue"
						total={`$${details.totalRevenue || 0}`}
						color="primary"
						icon={<MonetizationOnIcon />}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={3}>
					<AppWidgetSummary
						title="Total Lessons"
						total={details.totalLessons || 0}
						color="secondary"
						icon={<SchoolIcon />}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={3}>
					<AppWidgetSummary
						title="Average Rating"
						total={details.averageRating || 0}
						color="info"
						icon={<StarIcon />}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={3}>
					<AppWidgetSummary
						title="Low Stock Products"
						total={details.lowStockProducts || 0}
						color="error"
						icon={<InventoryIcon />}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					md={6}
					lg={8}>
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
								},
							],
						}}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					md={6}
					lg={4}>
					<AppCurrentVisits
						title="Product Categories"
						chart={{
							series: details.categoriesWithCount || [],
						}}
					/>
				</Grid>
			</Grid>
		</Container>
	) : (
		<Navigate to="/login" />
	)
}
