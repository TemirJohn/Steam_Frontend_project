import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../config/axiosConfig';
import { buildAssetUrl } from '../utils/url';
import { toast } from 'react-toastify';

function GameDetailAdvanced() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/games/${id}/details`);
                setData(res.data);
                console.log('⚡ Fetch time:', res.data.fetch_time_ms, 'ms');
            } catch (err) {
                console.error('Error fetching game details:', err);
                toast.error('Failed to load game details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white text-xl">⚡ Loading with concurrent fetching...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white text-xl">Game not found</p>
            </div>
        );
    }

    const { game, reviews, related_games, statistics, fetch_time_ms } = data;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                {/* Performance Badge */}
                <div className="mb-4 text-center">
                    <span className="bg-green-600 px-4 py-2 rounded-full text-sm">
                        ⚡ Loaded in {fetch_time_ms}ms using concurrent fetching
                    </span>
                </div>

                {/* Game Info */}
                <div className="bg-gray-800 p-6 rounded-xl mb-8">
                    <h1 className="text-4xl font-bold text-purple-400 mb-4">{game.name}</h1>
                    <img
                        src={buildAssetUrl(game.image)}
                        alt={game.name}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <p className="text-xl text-green-400 mb-2">${game.price.toFixed(2)}</p>
                    <p className="text-gray-300 mb-4">{game.description}</p>
                    <p className="text-sm text-gray-400">
                        Category: <span className="text-purple-300">{game.category?.name}</span>
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-yellow-400">{statistics.total_reviews}</p>
                        <p className="text-gray-400">Total Reviews</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-yellow-400">
                            {statistics.average_rating.toFixed(1)} / 5
                        </p>
                        <p className="text-gray-400">Average Rating</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-yellow-400">{statistics.total_owners}</p>
                        <p className="text-gray-400">Owners</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-yellow-400">{statistics.same_category}</p>
                        <p className="text-gray-400">Similar Games</p>
                    </div>
                </div>

                {/* Reviews */}
                <div className="bg-gray-800 p-6 rounded-xl mb-8">
                    <h2 className="text-2xl font-bold mb-4">Recent Reviews</h2>
                    {reviews.length === 0 ? (
                        <p className="text-gray-400">No reviews yet</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-gray-700 p-4 rounded-lg mb-2">
                                <div className="flex items-center mb-2">
                                    {review.user?.avatar && (
                                        <img
                                            src={buildAssetUrl(review.user.avatar)}
                                            alt={review.user.name}
                                            className="w-10 h-10 rounded-full mr-3 object-cover"
                                        />
                                    )}
                                    <span className="font-semibold">{review.user?.name}</span>
                                    <span className="ml-auto text-yellow-400">
                                        {'⭐'.repeat(review.rating)}
                                    </span>
                                </div>
                                <p className="text-gray-300">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Related Games */}
                {related_games && related_games.length > 0 && (
                    <div className="bg-gray-800 p-6 rounded-xl">
                        <h2 className="text-2xl font-bold mb-4">Related Games</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {related_games.map((relatedGame) => (
                                <Link
                                    key={relatedGame.id}
                                    to={`/games/${relatedGame.id}/advanced`}
                                    className="block"
                                >
                                    <div className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition">
                                        <img
                                            src={buildAssetUrl(relatedGame.image)}
                                            alt={relatedGame.name}
                                            className="w-full h-32 object-cover"
                                        />
                                        <div className="p-2">
                                            <p className="font-semibold text-sm truncate">{relatedGame.name}</p>
                                            <p className="text-green-400 text-sm">${relatedGame.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GameDetailAdvanced;