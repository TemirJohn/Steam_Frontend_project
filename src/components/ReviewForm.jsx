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
        <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-2">
                <label>Rating (1-5):</label>
                <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="border p-1 ml-2"
                />
            </div>
            <div className="mb-2">
                <label>Comment:</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border p-1 w-full"
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit Review</button>
        </form>
    );
}

export default ReviewForm;