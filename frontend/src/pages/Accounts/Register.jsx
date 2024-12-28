import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Divider } from '@mui/material';


const Register = () =>
{
    const navigate = useNavigate();

    const [ firstName, setFirstName ] = useState( '' );
    const [ lastName, setLastName ] = useState( '' );
    const [ email, setEmail ] = useState( '' );
    const [ username, setUsername ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ confirmPassword, setConfirmPassword ] = useState( '' );
    const [ phoneNumber, setPhoneNumber ] = useState( '' );
    const [ address, setAddress ] = useState( '' );
    const [ error, setError ] = useState( '' );
    const [ success, setSuccess ] = useState( '' );

    const handleRegister = async ( e ) =>
    {
        e.preventDefault();
        setError( '' );
        setSuccess( '' );

        if ( password !== confirmPassword )
        {
            setError( "Passwords don't match." );
            return;
        }

        try
        {
            const response = await axios.post( 'http://localhost:8080/api/account/register', {
                firstName,
                lastName,
                username,
                email,
                password,
                phoneNumber,
                address,
            } ).then( () =>
            {
                navigate( "/login" );
            } );
            setSuccess( response.data.message );
        } catch ( err )
        {
            console.log( err );

            setError( err.response?.data?.error || 'Something went wrong' );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-xl bg-white p-8 rounded-md shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
                { error && <p className="text-red-500 text-center">{ error }</p> }
                { success && <p className="text-green-500 text-center">{ success }</p> }
                <Divider />
                <form className="mt-8" onSubmit={ handleRegister }>
                    <div className="mb-4 flex gap-4">
                        <div className='w-full'>
                            <label className="block text-gray-700 mb-2">First Name</label>
                            <input
                                type="text"
                                value={ firstName }
                                onChange={ ( e ) => setFirstName( e.target.value ) }
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className='w-full'>
                            <label className="block text-gray-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                value={ lastName }
                                onChange={ ( e ) => setLastName( e.target.value ) }
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4 flex gap-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Username</label>
                            <input
                                type="text"
                                value={ username }
                                onChange={ ( e ) => setUsername( e.target.value ) }
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={ email }
                                onChange={ ( e ) => setEmail( e.target.value ) }
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4 flex gap-4">
                        <div className='w-full'>
                            <label className="block text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={ password }
                                onChange={ ( e ) => setPassword( e.target.value ) }
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className='w-full'>
                            <label className="block text-gray-700 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={ confirmPassword }
                                onChange={ ( e ) => setConfirmPassword( e.target.value ) }
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4 w-full">
                        <label className="block text-gray-700 mb-2">Phone Number</label>
                        <input
                            type="text"
                            value={ phoneNumber }
                            onChange={ ( e ) => setPhoneNumber( e.target.value ) }
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6 w-full">
                        <label className="block text-gray-700 mb-2">Address</label>
                        <input
                            type="text"
                            value={ address }
                            onChange={ ( e ) => setAddress( e.target.value ) }
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-amber-700  text-white py-2 rounded hover:bg-amber-600 active:bg-amber-800 transition"
                    >
                        Register
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm py-2">
                        Already have an account?{ ' ' }
                        <Link to="/login" className="text-amber-800 hover:underline">
                            Login here
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
    );
};

export default Register;
