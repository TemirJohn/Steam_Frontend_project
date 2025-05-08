import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authReducer';

function Navbar() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="flex justify-between items-center bg-gray-800 p-4 text-white shadow-md">
            <div className="flex items-center space-x-4">
                <Link to="/" className="hover:underline">Home</Link>
                {user && (user.role === 'admin' || user.role === 'developer') && (
                    <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                )}
            </div>

            <div ref={menuRef}>
                {user ? (
                    <>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
                        >
                            <img
                                src={`http://localhost:8080/${user.avatar}`}
                                className="w-10 h-10 rounded-full mr-4 object-cover"
                            />
                            <span className="hidden md:inline">{user.name}</span>

                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg overflow-hidden z-50">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Profile
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
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="hover:underline">Login</Link>
                            <Link to="/register" className="hover:underline">Register</Link>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;