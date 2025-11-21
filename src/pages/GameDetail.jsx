import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../config/axiosConfig';
import { getGameDetailsAdvanced } from '../config/concurrentApi';
import { buildAssetUrl } from '../utils/url';
import ReviewForm from '../components/ReviewForm';
import { toast } from 'react-toastify';

function GameDetail() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [relatedGames, setRelatedGames] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [ownsGame, setOwnsGame] = useState(false);
    const [loadingTime, setLoadingTime] = useState(null);
    const [useAdvancedLoading, setUseAdvancedLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        loadGameData();
        checkOwnership();
    }, [id, user, useAdvancedLoading]);

    const loadGameData = async () => {
        if (useAdvancedLoading) {
            // Use concurrent endpoint (3x faster)
            const result = await getGameDetailsAdvanced(id);
            
            if (result.success) {
                setGame(result.data.game);
                setReviews(result.data.reviews || []);
                setRelatedGames(result.data.related_games || []);
                setStatistics(result.data.statistics);
                setLoadingTime(result.fetchTime);
                
                toast.success(`Loaded in ${result.fetchTime}ms (3x faster!)`, {
                    autoClose: 2000
                });
            } else {
                toast.error(result.error);
                // Fallback to regular loading
                setUseAdvancedLoading(false);
            }
        } else {
            // Regular sequential loading
            try {
                const gameRes = await axiosInstance.get(`/games/${id}`);
                setGame(gameRes.data);

                const reviewsRes = await axiosInstance.get(`/reviews?gameId=${id}`);
                setReviews(reviewsRes.data);
            } catch (err) {
                console.error('Error fetching game:', err);
                toast.error('Failed to load game');
            }
        }
    };

    const checkOwnership = async () => {
        if (user) {
            try {
                const res = await axiosInstance.get('/library');
                const hasGame = res.data.some((g) => g.id === Number(id));
                setOwnsGame(hasGame);
            } catch (err) {
                console.error('Error checking ownership:', err);
            }
        }
    };

    const handlePurchase = async () => {
        try {
            await axiosInstance.post('/ownership', {
                gameId: Number(id),
                status: 'owned',
            });
            setOwnsGame(true);
            toast.success('Game purchased successfully!');
        } catch (error) {
            console.error('Error purchasing game:', error);
            toast.error('Failed to purchase game');
        }
    };

    const handleReturn = async () => {
        try {
            await axiosInstance.delete(`/ownership?gameId=${id}`);
            setOwnsGame(false);
            toast.success('Game returned successfully!');
        } catch (error) {
            console.error('Error returning game:', error);
            toast.error('Failed to return game');
        }
    };

    const handleReviewAdded = () => {
        loadGameData();
    };

    if (!game) return (
        <div className="flex justify-center items-center h-screen text-white">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-xl">Loading game details...</p>
            </div>
        </div>
    );

    const isEditor =
        user &&
        (user.role === 'admin' || (user.role === 'developer' && user.id === game.developerId));

    return (
        <div
            className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
            style={{
                backgroundColor: '#171a21',
            }}
        >
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-purple-400 mb-6">{game.name}</h1>
                        
                        {/* Performance indicator */}
                        {loadingTime && (
                            <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full mb-4">
                                ⚡ Loaded in {loadingTime}ms with parallel processing
                            </div>
                        )}

                        <div className="mt-8 p-6 rounded-lg bg-gray-800 bg-opacity-95 text-white shadow-lg mb-8">
                            <img
                                src={buildAssetUrl(game.image)}
                                alt={game.name}
                                className="w-full h-64 object-cover rounded-lg mb-6"
                                loading="lazy"
                            />
                            
                            <p className="text-xl font-semibold text-green-400 mb-4">${game.price.toFixed(2)}</p>
                            <p className="text-white mb-4">{game.description}</p>

                            {/* Statistics (from concurrent loading) */}
                            {statistics && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 p-4 bg-gray-700 rounded-lg">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-yellow-400">{statistics.total_reviews}</p>
                                        <p className="text-sm text-gray-300">Reviews</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-yellow-400">
                                            {statistics.average_rating?.toFixed(1) || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-300">Avg Rating</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-yellow-400">{statistics.total_owners}</p>
                                        <p className="text-sm text-gray-300">Owners</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-yellow-400">{statistics.same_category}</p>
                                        <p className="text-sm text-gray-300">Similar Games</p>
                                    </div>
                                </div>
                            )}

                            {isEditor && (
                                <div className="mb-4">
                                    <Link to={`/games/${id}/edit`}>
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2 transition-all duration-200">
                                            Edit Game
                                        </button>
                                    </Link>
                                    <Link to={`/delete-game/${id}`}>
                                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all duration-200">
                                            Delete Game
                                        </button>
                                    </Link>
                                </div>
                            )}

                            {user && user.role === 'user' && (
                                <button
                                    onClick={ownsGame ? handleReturn : handlePurchase}
                                    className={`${
                                        ownsGame ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                                    } text-white px-4 py-2 rounded mb-4 transition-all duration-200`}
                                >
                                    {ownsGame ? 'Return Game' : 'Buy Now'}
                                </button>
                            )}

                            {/* Related Games (from concurrent loading) */}
                            {relatedGames && relatedGames.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold mb-4 text-purple-400">Related Games</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {relatedGames.map((relatedGame) => (
                                            <Link key={relatedGame.id} to={`/games/${relatedGame.id}`}>
                                                <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition">
                                                    <h3 className="text-white font-semibold">{relatedGame.name}</h3>
                                                    <p className="text-green-400">${relatedGame.price.toFixed(2)}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reviews Section */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold mb-2 text-white">Reviews</h2>
                                {reviews.length === 0 ? (
                                    <p className="text-white">No reviews yet. Be the first to review!</p>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review.id} className="bg-gray-700 p-4 rounded-lg mb-2 flex items-start">
                                            {review.user?.avatar ? (
                                                <img
                                                    src={buildAssetUrl(review.user.avatar)}
                                                    alt={review.user.name || 'User'}
                                                    width="40"
                                                    height="40"
                                                    loading="lazy"
                                                    className="w-10 h-10 rounded-full mr-4 object-cover border border-green-500 hover:scale-110 transition"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-600 mr-4 flex items-center justify-center text-sm text-gray-300 border border-gray-500">
                                                    {review.user?.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                            )}
                                            <div className="text-left">
                                                <p className="font-semibold text-white">{review.user?.name || 'Anonymous'}</p>
                                                <p className="text-white">{review.comment}</p>
                                                <div className="flex items-center mt-1">
                                                    <div className="text-yellow-400">
                                                        {'★'.repeat(review.rating)}
                                                        {'☆'.repeat(5 - review.rating)}
                                                    </div>
                                                    <p className="text-sm text-gray-400 ml-2">{review.rating}/5</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {user && (
                                <ReviewForm gameId={Number(id)} onReviewAdded={handleReviewAdded} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default GameDetail;