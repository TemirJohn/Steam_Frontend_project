import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    validateAllGames, 
    bulkUpdateGamePrices,
    sendGameNotifications,
    processGameImages 
} from '../config/concurrentApi';
import { toast } from 'react-toastify';

function AdminTools() {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    
    // Validation state
    const [validating, setValidating] = useState(false);
    const [validationResult, setValidationResult] = useState(null);
    
    // Bulk update state
    const [updating, setUpdating] = useState(false);
    const [categoryId, setCategoryId] = useState('');
    const [action, setAction] = useState('validate');
    const [percentage, setPercentage] = useState(90);
    const [updateResult, setUpdateResult] = useState(null);
    
    // Notification state
    const [notifying, setNotifying] = useState(false);
    const [gameIdForNotify, setGameIdForNotify] = useState('');
    const [notifyResult, setNotifyResult] = useState(null);
    
    // Image processing state
    const [processing, setProcessing] = useState(false);
    const [gameIdForImages, setGameIdForImages] = useState('');
    const [imageResult, setImageResult] = useState(null);

    // Check admin access
    if (!user || user.role !== 'admin') {
        navigate('/login');
        return null;
    }

    // Validate all games
    const handleValidateAll = async () => {
        if (!window.confirm('This will validate ALL games in the database. Continue?')) {
            return;
        }

        setValidating(true);
        const result = await validateAllGames();
        
        if (result.success) {
            setValidationResult(result);
            toast.success(`✅ Validated ${result.totalGames} games in ${result.validationTime}`);
        } else {
            toast.error(result.error);
        }
        
        setValidating(false);
    };

    // Bulk update prices
    const handleBulkUpdate = async (e) => {
        e.preventDefault();
        
        if (!window.confirm(`This will ${action} games. Continue?`)) {
            return;
        }

        setUpdating(true);
        const result = await bulkUpdateGamePrices({
            category_id: categoryId ? parseInt(categoryId) : null,
            action: action,
            percentage: percentage / 100
        });
        
        if (result.success) {
            setUpdateResult(result);
            toast.success(`✅ Processed ${result.totalGames} games in ${result.processingTime}`);
        } else {
            toast.error(result.error);
        }
        
        setUpdating(false);
    };

    // Send notifications
    const handleNotify = async (e) => {
        e.preventDefault();
        
        if (!gameIdForNotify) {
            toast.error('Please enter a game ID');
            return;
        }

        if (!window.confirm(`Send notifications to all users about game ${gameIdForNotify}?`)) {
            return;
        }

        setNotifying(true);
        const result = await sendGameNotifications(gameIdForNotify);
        
        if (result.success) {
            setNotifyResult(result);
            toast.success(`📧 Sent ${result.notificationsSent}/${result.totalUsers} notifications in ${result.timeTaken}`);
        } else {
            toast.error(result.error);
        }
        
        setNotifying(false);
    };

    // Process images
    const handleProcessImages = async (e) => {
        e.preventDefault();
        
        if (!gameIdForImages) {
            toast.error('Please enter a game ID');
            return;
        }

        setProcessing(true);
        const result = await processGameImages(gameIdForImages);
        
        if (result.success) {
            setImageResult(result);
            toast.success(`🖼️ Processed ${result.imagesProcessed} images in ${result.processingTime}`);
        } else {
            toast.error(result.error);
        }
        
        setProcessing(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-purple-400 mb-8">
                    ⚡ Admin Tools - Concurrent Operations
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* 1. VALIDATE ALL GAMES */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
                            ✅ Validate All Games
                        </h2>
                        <p className="text-gray-300 mb-4">
                            Uses 15 workers to validate all games in parallel. 10x faster than sequential.
                        </p>
                        
                        <button
                            onClick={handleValidateAll}
                            disabled={validating}
                            className={`w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg transition ${
                                validating ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {validating ? '⏳ Validating...' : '✅ Start Validation'}
                        </button>

                        {validationResult && (
                            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                                <div className="grid grid-cols-3 gap-4 mb-2">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-400">
                                            {validationResult.validGames}
                                        </p>
                                        <p className="text-xs text-gray-400">Valid</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-red-400">
                                            {validationResult.invalidGames}
                                        </p>
                                        <p className="text-xs text-gray-400">Invalid</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-400">
                                            {validationResult.validationTime}
                                        </p>
                                        <p className="text-xs text-gray-400">Time</p>
                                    </div>
                                </div>
                                {validationResult.invalidDetails?.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm text-red-400">Invalid games:</p>
                                        <div className="max-h-32 overflow-y-auto">
                                            {validationResult.invalidDetails.map((item, idx) => (
                                                <p key={idx} className="text-xs text-gray-300">
                                                    Game #{item.game_id}: {item.error}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 2. BULK UPDATE PRICES */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
                            💰 Bulk Update Prices
                        </h2>
                        <p className="text-gray-300 mb-4">
                            Worker pool processes games in parallel. 10x faster for large batches.
                        </p>

                        <form onSubmit={handleBulkUpdate} className="space-y-3">
                            <div>
                                <label className="block text-sm mb-1">Category ID (optional)</label>
                                <input
                                    type="number"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    placeholder="Leave empty for all games"
                                    className="w-full bg-gray-700 p-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Action</label>
                                <select
                                    value={action}
                                    onChange={(e) => setAction(e.target.value)}
                                    className="w-full bg-gray-700 p-2 rounded"
                                >
                                    <option value="validate">Validate</option>
                                    <option value="update_prices">Update Prices</option>
                                </select>
                            </div>

                            {action === 'update_prices' && (
                                <div>
                                    <label className="block text-sm mb-1">
                                        Discount Percentage: {percentage}%
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={percentage}
                                        onChange={(e) => setPercentage(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={updating}
                                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition ${
                                    updating ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {updating ? '⏳ Processing...' : '🚀 Start Bulk Operation'}
                            </button>
                        </form>

                        {updateResult && (
                            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-400">
                                            {updateResult.successful}
                                        </p>
                                        <p className="text-xs text-gray-400">Successful</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-red-400">
                                            {updateResult.failed}
                                        </p>
                                        <p className="text-xs text-gray-400">Failed</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-400">
                                            {updateResult.processingTime}
                                        </p>
                                        <p className="text-xs text-gray-400">Time</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. SEND NOTIFICATIONS */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
                            📧 Send Bulk Notifications
                        </h2>
                        <p className="text-gray-300 mb-4">
                            20 workers send notifications in parallel. 1000 users in ~30 seconds.
                        </p>

                        <form onSubmit={handleNotify} className="space-y-3">
                            <div>
                                <label className="block text-sm mb-1">Game ID</label>
                                <input
                                    type="number"
                                    value={gameIdForNotify}
                                    onChange={(e) => setGameIdForNotify(e.target.value)}
                                    placeholder="Enter game ID"
                                    className="w-full bg-gray-700 p-2 rounded"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={notifying}
                                className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition ${
                                    notifying ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {notifying ? '📤 Sending...' : '📧 Send to All Users'}
                            </button>
                        </form>

                        {notifyResult && (
                            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-300 mb-2">
                                    Game: <span className="text-green-400">{notifyResult.game}</span>
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-400">
                                            {notifyResult.notificationsSent}/{notifyResult.totalUsers}
                                        </p>
                                        <p className="text-xs text-gray-400">Sent</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-400">
                                            {notifyResult.avgTimePerUser}ms
                                        </p>
                                        <p className="text-xs text-gray-400">Avg/User</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 4. PROCESS IMAGES */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
                            🖼️ Process Game Images
                        </h2>
                        <p className="text-gray-300 mb-4">
                            Pipeline processing: validation → thumbnails → metadata extraction.
                        </p>

                        <form onSubmit={handleProcessImages} className="space-y-3">
                            <div>
                                <label className="block text-sm mb-1">Game ID</label>
                                <input
                                    type="number"
                                    value={gameIdForImages}
                                    onChange={(e) => setGameIdForImages(e.target.value)}
                                    placeholder="Enter game ID"
                                    className="w-full bg-gray-700 p-2 rounded"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition ${
                                    processing ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {processing ? '⏳ Processing...' : '🖼️ Process Images'}
                            </button>
                        </form>

                        {imageResult && (
                            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-purple-400">
                                            {imageResult.imagesProcessed}
                                        </p>
                                        <p className="text-xs text-gray-400">Images</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-400">
                                            {imageResult.processingTime}
                                        </p>
                                        <p className="text-xs text-gray-400">Time</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Performance Info */}
                <div className="mt-8 p-6 bg-blue-900 bg-opacity-50 rounded-xl border border-blue-500">
                    <h3 className="text-xl font-semibold text-blue-300 mb-4">
                        ⚡ Concurrent Features Performance
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-gray-400">Validation</p>
                            <p className="text-white font-semibold">10x faster</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Bulk Updates</p>
                            <p className="text-white font-semibold">10x faster</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Notifications</p>
                            <p className="text-white font-semibold">20x faster</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Image Pipeline</p>
                            <p className="text-white font-semibold">3x faster</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminTools;