import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';

function ReviewForm({ gameId, onReviewAdded }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const user = useSelector((state) => state.auth.user);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!user) {
            toast.error('Please log in to submit a review');
            return;
        }

        if (comment.trim() === '') {
            toast.error('Comment cannot be empty');
            return;
        }

        const review = { gameId, rating, comment };

        try {
            await axios.post('/reviews', review);
            toast.success('Review submitted successfully!');
            onReviewAdded();
            setRating(5);
            setComment('');
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
                Rating:
                <div className="flex space-x-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </label>
            <label className="block">
                Comment:
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border p-2 rounded w-full mt-2"
                    placeholder="Write your thoughts about the game..."
                />
            </label>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
                Submit Review
            </button>
        </form>
    );
}

export default ReviewForm;