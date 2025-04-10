import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authReducer';

function Navbar() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    return (
        <nav className="navbar">
            <Link to="/">Home</Link>
            {user ? (
                <>
                    {(user.role === 'admin' || user.role === 'developer') && (
                        <Link to="/dashboard">Dashboard</Link>
                    )}
                    <Link to="/games">Games</Link>
                    <button onClick={() => dispatch(logout())} className="btn btn-red">Logout</button>
                    <span >👋 {user.username}</span>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;