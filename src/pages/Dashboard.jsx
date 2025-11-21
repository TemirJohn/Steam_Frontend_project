import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';

function Dashboard() {
    const user = useSelector((state) => state.auth.user);
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [validating, setValidating] = useState(false);

    // 🆕 Load statistics with concurrent fetching
    const loadStats = async () => {
        try {
            setLoadingStats(true);
            const res = await axiosInstance.get('/admin/dashboard/stats');
            setStats(res.data);
            toast.success(`Stats loaded in ${res.data.calculation_time}`);
        } catch (err) {
            console.error('Error loading stats:', err);
            toast.error('Failed to load stats');
        } finally {
            setLoadingStats(false);
        }
    };

    // 🆕 Validate all games
    const validateAllGames = async () => {
        try {
            setValidating(true);
            const res = await axiosInstance.post('/admin/games/validate-all');
            toast.success(`Validated ${res.data.total_games} games in ${res.data.validation_time}`);
            console.log('Validation results:', res.data);
        } catch (err) {
            console.error('Error validating games:', err);
            toast.error('Failed to validate games');
        } finally {
            setValidating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold mb-6 text-purple-400">Admin Dashboard</h1>

                    <p className="text-gray-300 mb-6">
                        Welcome, <span className="font-semibold text-green-400">{user?.name}</span>!
                        You are logged in as <strong>{user?.role}</strong>.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {user && user.role === 'admin' && (
                            <>
                                <Link to="/manage-users">
                                    <button className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition">
                                        👥 Manage Users
                                    </button>
                                </Link>
                                <Link to="/manage-categories">
                                    <button className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition">
                                        📁 Manage Categories
                                    </button>
                                </Link>
                            </>
                        )}

                        {user && (user.role === 'developer' || user.role === 'admin') && (
                            <Link to="/add-game">
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
                                    🎮 Add Game
                                </button>
                            </Link>
                        )}

                        {/* 🆕 Concurrent operations */}
                        {user && user.role === 'admin' && (
                            <>
                                <button
                                    onClick={loadStats}
                                    disabled={loadingStats}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50"
                                >
                                    {loadingStats ? '⏳ Loading...' : '📊 Load Statistics (Concurrent)'}
                                </button>
                                <button
                                    onClick={validateAllGames}
                                    disabled={validating}
                                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50"
                                >
                                    {validating ? '⏳ Validating...' : '✅ Validate All Games'}
                                </button>
                            </>
                        )}
                    </div>

                    {/* 🆕 Statistics Display */}
                    {stats && (
                        <div className="bg-gray-700 p-6 rounded-lg">
                            <h2 className="text-xl font-bold mb-4 text-purple-300">
                                Statistics (⚡ {stats.calculation_time})
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-yellow-400">
                                        {stats.statistics.total_users}
                                    </p>
                                    <p className="text-gray-400 text-sm">Total Users</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-yellow-400">
                                        {stats.statistics.total_games}
                                    </p>
                                    <p className="text-gray-400 text-sm">Total Games</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-yellow-400">
                                        {stats.statistics.total_reviews}
                                    </p>
                                    <p className="text-gray-400 text-sm">Total Reviews</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-yellow-400">
                                        {stats.statistics.average_rating.toFixed(1)}/5
                                    </p>
                                    <p className="text-gray-400 text-sm">Avg Rating</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;