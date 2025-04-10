import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Dashboard() {
    const user = useSelector((state) => state.auth.user);

    return (
        <div className="container">
            <h1>Dashboard</h1>

            {user && user.role === 'admin' && (
                <Link to="/manage-users">
                    <button className="btn btn-blue">Manage Users</button>
                </Link>
            )}

            {user && (user.role === 'developer' || user.role === 'admin') && (
                <Link to="/add-game">
                    <button className="btn btn-blue">Add Game</button>
                </Link>
            )}
        </div>
    );
}

export default Dashboard;