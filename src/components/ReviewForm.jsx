import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

function ReviewForm({ gameId, onReviewAdded }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const user = useSelector((state) => state.auth.user);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!user) return;

        const review = { userId: user.id, gameId, rating, comment };

        try {
            await axios.post('/reviews', review);
            onReviewAdded();
            setRating(5);
            setComment('');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Rating (1-5):
                <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                />
            </label>
            <label>
                Comment:
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </label>
            <button type="submit" className="btn btn-blue">Submit Review</button>
        </form>
    );
}

export default ReviewForm;