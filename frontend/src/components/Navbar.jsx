import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';

const Navbar = () =>
{
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated } = useSelector( ( state ) => state.auth );

    const handleLogout = async () =>
    {
        dispatch( logout() );
        navigate( '/' );
    };

    return (
        <nav className="bg-stone-800 py-8">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    <Link to="/">SoundCraft</Link>
                </div>

                <ul className="flex space-x-6 text-white">
                    <ul className="flex space-x-6 text-white">
                        <li>
                            <Link to="/" className="hover:text-gray-300">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/explore" className="hover:text-gray-300">
                                Explore
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-gray-300">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-gray-300">
                                Contact
                            </Link>
                        </li>
                        {
                            isAuthenticated ? (
                                <li>
                                    <Link
                                        onClick={ () => handleLogout() }
                                        className="rounded py-2 px-4 bg-amber-700 hover:bg-amber-600 active:bg-amber-800 transition">
                                        Logout
                                    </Link>
                                </li>
                            ) : (
                                <li>
                                    <Link
                                        to={ '/login' }
                                        className="rounded py-2 px-4 bg-amber-700 hover:bg-amber-600 active:bg-amber-800 transition">
                                        Login
                                    </Link>
                                </li>
                            )
                        }
                    </ul>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
