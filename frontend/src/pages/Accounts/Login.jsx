import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import axiosInstance from '../../utils/axios';
import { login } from '../../store/authSlice';

const Login = () =>
{
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ error, setError ] = useState( '' );
    const [ success, setSuccess ] = useState( '' );

    const handleLogin = async ( e ) =>
    {
        e.preventDefault();
        setError( '' );
        setSuccess( '' );

        axiosInstance()
            .post( 'api/account/login/', {
                email: email,
                password: password,
            } )
            .then( ( res ) =>
            {
                dispatch( login( res.data ) );
                toast.success( 'Login Successful' );
                navigate( '/' );
            } )
            .catch( ( err ) =>
            {
                setError( err.response?.data?.error || 'Something went wrong' );
                toast.error( 'Failed to Login' )
            } );
    };

    return (
        <>

            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md bg-white p-8 rounded-md shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                    { error && <p className="text-red-500 text-center">{ error }</p> }
                    { success && <p className="text-green-500 text-center">{ success }</p> }

                    <form onSubmit={ handleLogin }>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={ email }
                                onChange={ ( e ) => setEmail( e.target.value ) }
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={ password }
                                onChange={ ( e ) => setPassword( e.target.value ) }
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-amber-700  text-white py-2 rounded hover:bg-amber-600 active:bg-amber-800 transition"
                        >
                            Login
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-sm py-2">
                            Don&apos;t have an account?{ ' ' }
                            <Link to="/register" className="text-amber-800 hover:underline">
                                Register here
                            </Link>
                        </p>
                        <p className="text-sm py-2">
                            <Link to="/" className="text-amber-800 hover:underline">
                                Back to Homepage
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
