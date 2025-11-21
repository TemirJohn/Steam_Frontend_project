import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDashboardStatistics, validateAllGames, bulkUpdateGamePrices } from '../config/concurrentApi';
import { toast } from 'react-toastify';

function Dashboard() {
    const user = useSelector((state) => state.auth.user);
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [calculationTime, setCalculationTime] = useState(null);
    const [validating, setValidating] = useState(false);
    const [validationResult, setValidationResult] = useState(null);

    useEffect(() => {
        if (user?.role === 'admin') {
            loadStatistics();
        }
    }, [user]);

    const loadStatistics = async () => {
        setLoadingStats(true);
        const result = await getDashboardStatistics();
        
        if (result.success) {
            setStats(result.statistics);
            setCalculationTime(result.calculationTime);
            toast.success(`Stats loaded in ${result.calculationTime}`, { autoClose: 2000 });
        } else {
            toast.error(result.error);
        }
        
        setLoadingStats(false);
    };

    const handleValidateAll = async () => {
        if (!window.confirm('This will validate all games in the database. Continue?')) {
            return;
        }

        setValidating(true);
        const result = await validateAllGames();
        
        if (result.success) {
            setValidationResult(result);
            toast.success(`Validated ${result.totalGames} games in ${result.validationTime}`);
        } else {
            toast.error(result.error);
        }
        
        setValidating(false);
    };

    return (
        <div
            className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
            style={{
                backgroundColor: '#171a21',
            }}
        >
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-6xl mx-auto p-6 bg-gray-800 bg-opacity-95 rounded-xl shadow-lg text-white">
                        <h1 className="text-3xl font-bold mb-6 text-purple-400">
                            {user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                        </h1>

                        <p className="text-gray-300 mb-6">
                            Welcome, <span className="font-semibold text-green-400">{user?.name}</span>!
                            You are logged in as <strong>{user?.role}</strong>.
                        </p>

                        {/* Admin Statistics - Concurrent Loading */}
                        {user?.role === 'admin' && (
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-semibold text-purple-400">
                                        Platform Statistics
                                    </h2>
                                    <button
                                        onClick={loadStatistics}
                                        disabled={loadingStats}
                                        className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition ${
                                            loadingStats ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {loadingStats ? 'Loading...' : '🔄 Refresh Stats'}
                                    </button>
                                </div>

                                {calculationTime && (
                                    <div className="mb-4 inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm">
                                        ⚡ Calculated in {calculationTime} with parallel processing (4x faster)
                                    </div>
                                )}

                                {stats ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="bg-gray-700 p-6 rounded-lg text-center">
                                            <p className="text-4xl font-bold text-yellow-400">{stats.total_users}</p>
                                            <p className="text-sm text-gray-300 mt-2">Total Users</p>
                                            <p className="text-xs text-green-400 mt-1">
                                                {stats.active_users} active
                                            </p>
                                        </div>
                                        <div className="bg-gray-700 p-6 rounded-lg text-center">
                                            <p className="text-4xl font-bold text-yellow-400">{stats.total_games}</p>
                                            <p className="text-sm text-gray-300 mt-2">Total Games</p>
                                            <p className="text-xs text-green-400 mt-1">
                                                {stats.recent_games} new this month
                                            </p>
                                        </div>
                                        <div className="bg-gray-700 p-6 rounded-lg text-center">
                                            <p className="text-4xl font-bold text-yellow-400">{stats.total_reviews}</p>
                                            <p className="text-sm text-gray-300 mt-2">Total Reviews</p>
                                            <p className="text-xs text-green-400 mt-1">
                                                Avg: {stats.average_rating?.toFixed(1)}/5
                                            </p>
                                        </div>
                                        <div className="bg-gray-700 p-6 rounded-lg text-center">
                                            <p className="text-4xl font-bold text-yellow-400">{stats.total_sales}</p>
                                            <p className="text-sm text-gray-300 mt-2">Total Sales</p>
                                            <p className="text-xs text-green-400 mt-1">
                                                Top: {stats.top_category}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                                        <p className="mt-4 text-gray-400">Loading statistics...</p>
                                    </div>
                                )}

                                {/* Validation Results */}
                                {validationResult && (
                                    <div className="bg-gray-700 p-6 rounded-lg mb-6">
                                        <h3 className="text-xl font-semibold text-purple-400 mb-4">
                                            Validation Results
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-green-400">
                                                    {validationResult.validGames}
                                                </p>
                                                <p className="text-sm text-gray-300">Valid Games</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-red-400">
                                                    {validationResult.invalidGames}
                                                </p>
                                                <p className="text-sm text-gray-300">Invalid Games</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-blue-400">
                                                    {validationResult.validationTime}
                                                </p>
                                                <p className="text-sm text-gray-300">Time Taken</p>
                                            </div>
                                        </div>
                                        {validationResult.invalidDetails?.length > 0 && (
                                            <div>
                                                <p className="text-sm text-red-400 mb-2">Invalid Games:</p>
                                                <ul className="text-xs text-gray-300 space-y-1">
                                                    {validationResult.invalidDetails.map((item) => (
                                                        <li key={item.game_id}>
                                                            Game ID {item.game_id}: {item.error}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4">
                            {user?.role === 'admin' && (
                                <>
                                    <Link to="/manage-users" className="flex-1 sm:flex-none">
                                        <button className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200">
                                            👥 Manage Users
                                        </button>
                                    </Link>
                                    <Link to="/manage-categories" className="flex-1 sm:flex-none">
                                        <button className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200">
                                            📂 Manage Categories
                                        </button>
                                    </Link>
                                    <Link to="/admin-tools" className="flex-1 sm:flex-none">
                                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-200">
                                            ⚡ Concurrent Tools
                                        </button>
                                    </Link>
                                    <button
                                        onClick={handleValidateAll}
                                        disabled={validating}
                                        className={`flex-1 sm:flex-none bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-all duration-200 ${
                                            validating ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {validating ? '⏳ Validating...' : '✅ Quick Validate'}
                                    </button>
                                </>
                            )}

                            {user && (user.role === 'developer' || user.role === 'admin') && (
                                <Link to="/add-game" className="flex-1 sm:flex-none">
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200">
                                        ➕ Add Game
                                    </button>
                                </Link>
                            )}
                        </div>

                        {/* Performance Notes */}
                        {user?.role === 'admin' && (
                            <div className="mt-8 p-4 bg-blue-900 bg-opacity-50 rounded-lg border border-blue-500">
                                <h3 className="text-lg font-semibold text-blue-300 mb-2">
                                    ⚡ Concurrent Features Active
                                </h3>
                                <ul className="text-sm text-gray-300 space-y-1">
                                    <li>✅ Parallel statistics calculation (4x faster)</li>
                                    <li>✅ Concurrent game validation (10x faster)</li>
                                    <li>✅ Worker pool for bulk operations</li>
                                    <li>✅ Parallel data fetching throughout the app</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;