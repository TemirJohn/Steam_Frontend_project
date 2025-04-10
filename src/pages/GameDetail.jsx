import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';

function GameDetail() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [reviews, setReviews] = useState([]);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        fetch(`http://localhost:3001/games/${id}`)
            .then((res) => res.json())
            .then((data) => setGame(data));
        fetch(`http://localhost:3001/reviews?gameId=${id}`)
            .then((res) => res.json())
            .then((data) => setReviews(data));
    }, [id]);

    async function handlePurchase() {
        if (!user) {
            alert('Please log in to purchase');
            return;
        }

        const purchase = {
            userId: user.id,
            gameId: Number(id),
            purchaseDate: new Date().toISOString().split('T')[0],
        };

        try {
            const response = await fetch('http://localhost:3001/purchases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(purchase),
            });
            if (response.ok) {
                alert('Game purchased successfully!');
            }
        } catch (error) {
            console.error('Error purchasing game:', error);
        }
    }

    if (!game) return <div>Loading...</div>;

    const handleReviewAdded = () => {
        fetch(`http://localhost:3001/reviews?gameId=${id}`)
            .then((res) => res.json())
            .then((data) => setReviews(data));
    };

    const isEditor = user && (user.role === 'admin' || user.role === 'developer');

    if (!game) return <div>Loading...</div>;

    return (
        <div className="container">
            <h1>{game.title}</h1>
            <p>${game.price}</p>
            <p>{game.description}</p>
            {isEditor && (
                <Link to={`/games/${id}/edit`}>
                    <button style={{ color:'red' }} className="btn btn-yellow">Edit Game</button>
                </Link>
            )}

            {user && user.role === 'user' && (
                <button
                    onClick={handlePurchase}
                    className="btn btn-green"
                >
                    Buy Now
                </button>
            )}
            <h2>Reviews</h2>
            <ul>
                {reviews.map((review) => (
                    <li key={review.id}>
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