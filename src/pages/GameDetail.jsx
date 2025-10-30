import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import ReviewForm from '../components/ReviewForm';
import { toast } from 'react-toastify';

function GameDetail() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [ownsGame, setOwnsGame] = useState(false);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        axios.get(`/games/${id}`)
            .then((res) => setGame(res.data))
            .catch((err) => {
                console.error('Error fetching game:', err);
                toast.error('Failed to load game');
            });

        axios.get(`/reviews?gameId=${id}`)
            .then((res) => setReviews(res.data))
            .catch((err) => {
                console.error('Error fetching reviews:', err);
                toast.error('Failed to load reviews');
            });

        if (user) {
            axios.get('/library')
                .then((res) => {
                    const hasGame = res.data.some((g) => g.id === Number(id));
                    setOwnsGame(hasGame);
                })
                .catch((err) => {
                    console.error('Error checking ownership:', err);
                });
        }
    }, [id, user]);

    const handlePurchase = async () => {
        try {
            await axios.post('/ownership', {
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
            await axios.delete(`/ownership?gameId=${id}`);
            setOwnsGame(false);
            toast.success('Game returned successfully!');
        } catch (error) {
            console.error('Error returning game:', error);
            toast.error('Failed to return game');
        }
    };

    const handleReviewAdded = () => {
        axios.get(`/reviews?gameId=${id}`)
            .then((res) => setReviews(res.data))
            .catch((err) => {
                console.error('Error fetching reviews:', err);
                toast.error('Failed to load reviews');
            });
    };

    if (!game) return <div>Loading...</div>;

    const isEditor =
        user &&
        (user.role === 'admin' || (user.role === 'developer' && user.id === game.developerId));

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{game.name}</h1>
            <img
                src={`http://localhost:8080/${game.image}`}
                alt={game.name}
                className="w-full h-64 object-cover mb-4"
            />
            <p className="text-lg mb-2">${game.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-4">{game.description}</p>

            {isEditor && (
                <div className="mb-4">
                    <Link to={`/games/${id}/edit`}>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                            Edit Game
                        </button>
                    </Link>
                    <Link to={`/delete-game/${id}`}>
                        <button className="bg-red-500 text-white px-4 py-2 rounded">
                            Delete Game
                        </button>
                    </Link>
                </div>
            )}

            {user && user.role === 'user' && (
                <button
                    onClick={ownsGame ? handleReturn : handlePurchase}
                    className={`${
                        ownsGame ? 'bg-yellow-500' : 'bg-green-500'
                    } text-white px-4 py-2 rounded mb-4`}
                >
                    {ownsGame ? 'Return Game' : 'Buy Now'}
                </button>
            )}

            <h2 className="text-xl font-semibold mb-2">Reviews</h2>
            <ul className="mb-4">
                {reviews.map((review) => (
                    <li key={review.id} className="border-b py-2 flex items-start">
                        {review.user?.avatar ? (
                            <img
                                src={`http://localhost:8080/${review.user.avatar}`}
                                alt={review.user.name}
                                className="w-10 h-10 rounded-full mr-4 object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 mr-4 flex items-center justify-center">
                                <span className="text-gray-600">{review.user?.name?.[0] || 'U'}</span>
                            </div>
                        )}
                        <div>
                            <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                            <p>Rating: {review.rating}/5 - {review.comment}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {user && (
                <ReviewForm gameId={Number(id)} onReviewAdded={handleReviewAdded} />
            )}
        </div>
    );
}

export default GameDetail;