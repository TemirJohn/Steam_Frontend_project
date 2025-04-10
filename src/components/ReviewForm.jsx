import { useState } from 'react';
import { useSelector } from 'react-redux';

function ReviewForm({ gameId, onReviewAdded }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const user = useSelector((state) => state.auth.user);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!user) return;

        const review = { userId: user.id, gameId, rating, comment };

        try {
            const response = await fetch('http://localhost:3001/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(review),
            });
            if (response.ok) {
                onReviewAdded();
                setRating(5);
                setComment('');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
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