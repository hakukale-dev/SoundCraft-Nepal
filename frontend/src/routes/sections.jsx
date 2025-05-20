import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Route, Routes, Navigate } from 'react-router-dom'

import BasicLayout from 'src/layouts/basic'
import DashboardLayout from 'src/layouts/dashboard'

import DashboardPage from 'src/pages/admin/dashboard'
import UserPage from 'src/pages/admin/users'
import AdminProductsPage from 'src/pages/admin/products'
import AdminLearningHubPage from 'src/pages/admin/learning-hub'
import QueriesView from '../sections/admin/queries'
import AdminChatView from '../sections/admin/chat'
import OrdersView from '../sections/admin/orders'

import LoginPage from 'src/pages/auth/login'
import SignUpPage from 'src/pages/auth/signup'
import ForgotPasswordPage from '../pages/auth/forgot-password'
import ResetPasswordPage from '../pages/auth/reset-password'

import HomePage from 'src/pages/public/homepage'
import AboutUsPage from 'src/pages/public/about'
import ContactPage from 'src/pages/public/contact'
import ProfilePage from 'src/pages/public/profile'
import ProductsPage from 'src/pages/public/products'
import ProductDetailsPage from 'src/sections/public/product-details'
import LearningZonePage from 'src/sections/public/learning-zone'
import LessonPage from 'src/pages/public/lesson-page'
import WishlistPage from 'src/pages/public/wishlist'

import NotFoundPage from 'src/pages/404'

import { checkForToken } from 'src/store/authSlice'
import LoadingPage from '../pages/Loading'
import CartItemsPage from '../pages/public/cartItems'
import CheckoutPageView from '../sections/public/checkout'
import PurchaseHistoryPage from '../pages/public/purchase-history'
import PaymentSuccessPage from 'src/pages/public/payment-success'
import PaymentFailurePage from 'src/pages/public/payment-failure'

// ----------------------------------------------------------------------
export default function Router() {
	const dispatch = useDispatch()
	const { isAuthenticated, user, loading } = useSelector(
		(state) => state.auth
	)

	useEffect(() => {
		dispatch(checkForToken())
	}, [dispatch])

	// eslint-disable-next-line react/prop-types
	const ProtectedRoute = ({ children }) => {
		if (!isAuthenticated) {
			return (
				<Navigate
					to="/login"
					replace
				/>
			)
		}
		return children
	}
	// eslint-disable-next-line react/prop-types
	const AdminRoute = ({ children }) => {
		if (!user?.is_admin) {
			return (
				<Navigate
					to="/"
					replace
				/>
			)
		}
		return children
	}

	return loading ? (
		<LoadingPage />
	) : (
		<Routes>
			{/* Public Routes */}
			<Route
				path="login"
				element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
			/>
			<Route
				path="signup"
				element={
					!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />
				}
			/>
			<Route
				path="forgot-password"
				element={
					!isAuthenticated ? (
						<ForgotPasswordPage />
					) : (
						<Navigate to="/" />
					)
				}
			/>
			<Route
				path="reset-password"
				element={
					!isAuthenticated ? (
						<ResetPasswordPage />
					) : (
						<Navigate to="/" />
					)
				}
			/>

			{/* Basic Layout Routes */}
			<Route
				path="/"
				element={<BasicLayout user={user} />}>
				<Route
					index
					element={<HomePage />}
				/>
				<Route
					path="homepage"
					element={<HomePage />}
				/>
				<Route
					path="about"
					element={<AboutUsPage />}
				/>
				<Route
					path="contact"
					element={<ContactPage />}
				/>
				<Route
					path="products"
					element={<ProductsPage />}
				/>
				<Route
					path="products/:id"
					element={<ProductDetailsPage />}
				/>
				<Route
					path="profile"
					element={
						<ProtectedRoute>
							<ProfilePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="cart"
					element={
						<ProtectedRoute>
							<CartItemsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="checkout"
					element={
						<ProtectedRoute>
							<CheckoutPageView />
						</ProtectedRoute>
					}
				/>
				<Route
					path="purchase-history"
					element={
						<ProtectedRoute>
							<PurchaseHistoryPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="payment-success"
					element={
						<ProtectedRoute>
							<PaymentSuccessPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="payment-failure"
					element={
						<ProtectedRoute>
							<PaymentFailurePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="wishlist"
					element={
						<ProtectedRoute>
							<WishlistPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="learning-zone"
					element={<LearningZonePage />}
				/>
				<Route
					path="lessons/:id"
					element={<LessonPage />}
				/>
				<Route
					path="404"
					element={<NotFoundPage />}
				/>
				<Route
					path="*"
					element={<NotFoundPage />}
				/>
			</Route>

			{/* Dashboard Layout Routes - All Protected */}
			<Route
				element={
					<ProtectedRoute>
						<AdminRoute>
							<DashboardLayout user={user} />
						</AdminRoute>
					</ProtectedRoute>
				}>
				<Route
					path="admin/dashboard"
					element={<DashboardPage />}
				/>
				<Route
					path="admin/users"
					element={<UserPage />}
				/>
				<Route
					path="admin/products"
					element={<AdminProductsPage />}
				/>
				<Route
					path="admin/learning-hub"
					element={<AdminLearningHubPage />}
				/>
				<Route
					path="admin/profile"
					element={<ProfilePage />}
				/>
				<Route
					path="admin/queries"
					element={<QueriesView />}
				/>
				<Route
					path="admin/chat"
					element={<AdminChatView />}
				/>
				<Route
					path="admin/orders"
					element={<OrdersView />}
				/>
			</Route>
		</Routes>
	)
}
