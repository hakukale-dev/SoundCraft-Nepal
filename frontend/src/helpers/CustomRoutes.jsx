import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import store from '../store/store';
import { checkForToken } from '../store/authSlice';

import Navbar from '../components/Navbar'
import Home from '../pages/Home'
import Login from '../pages/Accounts/Login'
import Register from '../pages/Accounts/Register'
import About from '../pages/About'
import Contact from '../pages/Contact'
import MainStore from '../pages/MainStore'
import Protected from './Protected'
import Footer from '../components/Footer'

function CustomRoutes ()
{
    const { isAuthenticated, user } = useSelector( ( state ) => state.auth );

    useEffect( () =>
    {
        if ( !isAuthenticated && !user )
        {
            store.dispatch( checkForToken() );
        }
    } );

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Routes>
                    <Route
                        path="/login"
                        element={ user ? <Navigate to="/" /> : <Login /> }
                    />
                    <Route
                        path="/register"
                        element={ user ? <Navigate to="/" /> : <Register /> }
                    />
                    <Route
                        path="*"
                        element={
                            <>
                                <Navbar />
                                <main className="flex-grow">
                                    <Routes>
                                        <Route path="/" element={ <Home /> } />
                                        <Route path="/about" element={ <About /> } />
                                        <Route path="/contact" element={ <Contact /> } />
                                        <Route path="/explore" element={ <MainStore /> } />
                                        <Route path="*" element={
                                            <Protected user={ user } props={
                                                <Routes>
                                                    <Route path="/dashboard" element={ <h1>Dashboard</h1> } />
                                                    <Route path="/profile" element={ <h1>Profile</h1> } />
                                                </Routes>
                                            } />
                                        } />
                                    </Routes>
                                </main>
                                <Footer />
                            </>
                        }
                    />
                </Routes>
            </div>
        </Router>
    )
}

CustomRoutes.propTypes = {
    user: PropTypes.object,
}

export default CustomRoutes