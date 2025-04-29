import { useState, useEffect } from 'react';
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
    }, [id]);

    const handlePurchase = async () => {
        if (!user) {
            toast.error('Please log in to purchase');
            return;
        }

        try {
            await axios.post('/ownership', {
                gameId: Number(id),
                status: 'owned',
            });
            toast.success('Game purchased successfully!');
        } catch (error) {
            console.error('Error purchasing game:', error);
            toast.error('Failed to purchase game');
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
                src={`http://localhost:8080/${game.image}`} // можешь заменить на `${process.env.REACT_APP_API_URL}/${game.image}` для продакшна
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
                    onClick={handlePurchase}
                    className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                >
                    Buy Now
                </button>
            )}

            <h2 className="text-xl font-semibold mb-2">Reviews</h2>
            <ul className="mb-4">
                {reviews.map((review) => (
                    <li key={review.id} className="border-b py-2">
                        Rating: {review.rating}/5 - {review.comment}
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