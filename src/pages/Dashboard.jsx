import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Dashboard() {
    const user = useSelector((state) => state.auth.user);

    return (
        <div
            className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
            style={{
                backgroundColor: '#171a21',
            }}
        >
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto p-6 bg-gray-800 bg-opacity-95 rounded-xl shadow-lg text-white">
                        <h1 className="text-3xl font-bold mb-6 text-purple-400">Admin Dashboard</h1>

                        <p className="text-gray-300 mb-6">
                            Welcome, <span className="font-semibold text-green-400">{user?.name}</span>!
                            You are logged in as <strong>{user?.role}</strong>.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {user && user.role === 'admin' && (
                                <>
                                    <Link to="/manage-users" className="w-full sm:w-auto">
                                        <button className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all duration-200">
                                            Manage Users
                                        </button>
                                    </Link>
                                    <Link to="/manage-categories" className="w-full sm:w-auto">
                                        <button className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all duration-200">
                                            Manage Categories
                                        </button>
                                    </Link>
                                </>
                            )}

                            {user && (user.role === 'developer' || user.role === 'admin') && (
                                <Link to="/add-game" className="w-full sm:w-auto">
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200">
                                        Add Game
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;