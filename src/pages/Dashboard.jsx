import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Dashboard() {
    const user = useSelector((state) => state.auth.user);

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

            <p className="text-gray-600 mb-6">
                Welcome, <span className="font-semibold text-blue-600">{user?.name}</span>!
                You are logged in as <strong>{user?.role}</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                {user && user.role === 'admin' && (
                    <Link to="/manage-users" className="w-full sm:w-auto">
                        <button className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition">
                            Manage Users
                        </button>
                    </Link>
                )}

                {user && (user.role === 'developer' || user.role === 'admin') && (
                    <Link to="/add-game" className="w-full sm:w-auto">
                        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition">
                            Add Game
                        </button>
                    </Link>
                )}
            </div>

        </div>
    );
}

export default Dashboard;