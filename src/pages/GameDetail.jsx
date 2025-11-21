import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../config/axiosConfig';
import { buildAssetUrl } from '../utils/url';
import ReviewForm from '../components/ReviewForm';
import { toast } from 'react-toastify';

function GameDetail() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [ownsGame, setOwnsGame] = useState(false);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        // 🚀 ПАРАЛЛЕЛЬНАЯ ЗАГРУЗКА ВСЕХ ДАННЫХ
        const loadGameData = async () => {
            setLoading(true);
            try {
                // Создаем массив промисов для параллельного выполнения
                const promises = [
                    axiosInstance.get(`/games/${id}`),
                    axiosInstance.get(`/reviews?gameId=${id}`)
                ];

                // Добавляем проверку владения только для авторизованных пользователей
                if (user) {
                    promises.push(axiosInstance.get('/library'));
                }

                // Выполняем все запросы параллельно
                const results = await Promise.all(promises);

                // Обрабатываем результаты
                setGame(results[0].data);
                setReviews(results[1].data);

                if (user && results[2]) {
                    const hasGame = results[2].data.some((g) => g.id === Number(id));
                    setOwnsGame(hasGame);
                }
            } catch (err) {
                console.error('Error loading game data:', err);
                toast.error('Failed to load game data');
            } finally {
                setLoading(false);
            }
        };

        loadGameData();
    }, [id, user]);

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
        axiosInstance.get(`/reviews?gameId=${id}`)
            .then((res) => setReviews(res.data))
            .catch((err) => {
                console.error('Error fetching reviews:', err);
                toast.error('Failed to load reviews');
            });
    };

    // Показываем загрузку
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-white text-xl">Loading game...</p>
                </div>
            </div>
        );
    }

    if (!game) return <div className="text-center text-white">Game not found</div>;

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

                        <div className="mt-8 p-6 rounded-lg bg-gray-800 bg-opacity-95 text-white shadow-lg mb-8">
                            <img
                                src={buildAssetUrl(game.image)}
                                alt={game.name}
                                className="w-full h-64 object-cover rounded-lg mb-6"
                                loading="lazy"
                            />
                            <p className="text-xl font-semibold text-green-400 mb-4">${game.price.toFixed(2)}</p>
                            <p className="text-white mb-4">{game.description}</p>

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
                                                <p className="text-sm text-gray-400">Rating: {review.rating}/5</p>
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