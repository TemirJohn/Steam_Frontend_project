import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authReducer';

function Navbar() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
            <div className="flex items-center space-x-4">
                <Link to="/" className="hover:underline">Home</Link>
                {user && (user.role === 'admin' || user.role === 'developer') && (
                    <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                )}
            </div>

            <div className="relative flex items-center space-x-4">
                {user ? (
                    <>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                        >
                            <span className="text-lg">👤</span>
                            <span className="hidden md:inline">{user.name}</span>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg overflow-hidden z-20">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/settings"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:underline">Login</Link>
                        <Link to="/register" className="hover:underline">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;