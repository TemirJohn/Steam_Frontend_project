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
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-xl shadow-md text-white">
            <div>
                <label className="block mb-2 text-lg font-semibold text-purple-300">Rating:</label>
                <div className="flex space-x-2">
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
            </div>

            <div>
                <label className="block mb-2 text-lg font-semibold text-purple-300">Comment:</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full h-32 bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Write your thoughts about the game..."
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all shadow"
            >
                Submit Review
            </button>
        </form>
    );
}

export default ReviewForm;