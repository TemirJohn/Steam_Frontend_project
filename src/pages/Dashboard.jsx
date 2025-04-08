import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Dashboard() {
    const user = useSelector((state) => state.auth.user);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Dashboard</h1>
            {user && user.role === 'admin' ? (
                <Link to="/manage-users">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Manage Users</button>
                </Link>
            ) : user && user.role === 'developer' ? (
                <Link to="/add-game">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Add Game</button>
                </Link>
            ) : (
                <p>Welcome to Dashboard</p>
            )}
            <Link to="/games">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Browse Games</button>
            </Link>
        </div>
    );
}

export default Dashboard;