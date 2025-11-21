import { useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';
import { validateRating, validateComment, sanitizeInput } from '../utils/validation';

function ReviewForm({ gameId, onReviewAdded }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const user = useSelector((state) => state.auth.user);

    const handleCommentChange = (e) => {
        const value = e.target.value;
        setComment(value);
        
        // Clear error when typing
        if (errors.comment) {
            setErrors(prev => ({ ...prev, comment: null }));
        }
    };

    const handleRatingClick = (newRating) => {
        setRating(newRating);
        if (errors.rating) {
            setErrors(prev => ({ ...prev, rating: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        const ratingError = validateRating(rating);
        if (ratingError) newErrors.rating = ratingError;
        
        const commentError = validateComment(comment);
        if (commentError) newErrors.comment = commentError;
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (!user) {
            toast.error('Please log in to submit a review');
            return;
        }

        // Frontend validation
        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        setIsSubmitting(true);

        const review = {
            gameId,
            rating: parseInt(rating),
            comment: sanitizeInput(comment)
        };

        try {
            await axiosInstance.post('/reviews', review);
            toast.success('Review submitted successfully!');
            onReviewAdded();
            setRating(5);
            setComment('');
            setErrors({});
        } catch (error) {
            console.error('Error submitting review:', error);
            
            const errorData = error.response?.data;
            
            if (errorData?.errors) {
                Object.entries(errorData.errors).forEach(([field, message]) => {
                    toast.error(message);
                    setErrors(prev => ({ ...prev, [field]: message }));
                });
            } else if (errorData?.error) {
                toast.error(errorData.error);
            } else {
                toast.error('Failed to submit review');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-xl shadow-md text-white">
            {/* Rating */}
            <div>
                <label className="block mb-2 text-lg font-semibold text-purple-300">
                    Rating: *
                </label>
                <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            type="button"
                            key={star}
                            onClick={() => handleRatingClick(star)}
                            disabled={isSubmitting}
                            className={`text-3xl transition-transform hover:scale-110 ${
                                star <= rating ? 'text-yellow-400' : 'text-gray-400'
                            } ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            aria-label={`Rate ${star} stars`}
                        >
                            ★
                        </button>
                    ))}
                </div>
                {errors.rating && (
                    <p className="text-red-400 text-sm mt-1">{errors.rating}</p>
                )}
                <p className="text-gray-400 text-sm mt-1">
                    Selected: {rating} / 5 stars
                </p>
            </div>

            {/* Comment */}
            <div>
                <label className="block mb-2 text-lg font-semibold text-purple-300">
                    Comment: *
                </label>
                <textarea
                    value={comment}
                    onChange={handleCommentChange}
                    className={`w-full h-32 bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 resize-none ${
                        errors.comment ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
                    }`}
                    placeholder="Write your thoughts about the game..."
                    disabled={isSubmitting}
                    maxLength="1000"
                    required
                />
                {errors.comment && (
                    <p className="text-red-400 text-sm mt-1">{errors.comment}</p>
                )}
                <p className="text-gray-400 text-sm mt-1">
                    {comment.length}/1000 characters
                </p>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all shadow ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}

export default ReviewForm;