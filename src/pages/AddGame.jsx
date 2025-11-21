import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosConfig';
import { addGame } from '../redux/gameReducer';
import { toast } from 'react-toastify';
import {
    validateGameName,
    validatePrice,
    validateDescription,
    validateCategory,
    validateImageFile,
    sanitizeInput
} from '../utils/validation';

function AddGame() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'developer')) {
            toast.error('Access denied');
            navigate('/login');
            return;
        }

        axiosInstance.get('/categories')
            .then((res) => setCategories(res.data))
            .catch((err) => {
                console.error('Error fetching categories:', err);
                if (err.response?.status === 401) {
                    toast.error('Unauthorized: Please log in again');
                    navigate('/login');
                } else {
                    toast.error('Failed to load categories');
                }
            });
    }, [user, navigate]);

    // Real-time validation handlers
    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        if (errors.name) {
            setErrors(prev => ({ ...prev, name: null }));
        }
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        setPrice(value);
        if (errors.price) {
            setErrors(prev => ({ ...prev, price: null }));
        }
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setDescription(value);
        if (errors.description) {
            setErrors(prev => ({ ...prev, description: null }));
        }
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setCategoryId(value);
        if (errors.categoryId) {
            setErrors(prev => ({ ...prev, categoryId: null }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            const imageError = validateImageFile(file);
            if (imageError) {
                setErrors(prev => ({ ...prev, image: imageError }));
                setImage(null);
                e.target.value = '';
                toast.error(imageError);
            } else {
                setImage(file);
                setErrors(prev => ({ ...prev, image: null }));
            }
        }
    };

    // Validate entire form
    const validateForm = () => {
        const newErrors = {};
        
        const nameError = validateGameName(name);
        if (nameError) newErrors.name = nameError;
        
        const priceError = validatePrice(price);
        if (priceError) newErrors.price = priceError;
        
        const descError = validateDescription(description);
        if (descError) newErrors.description = descError;
        
        const catError = validateCategory(categoryId);
        if (catError) newErrors.categoryId = catError;
        
        const imageError = validateImageFile(image);
        if (imageError) newErrors.image = imageError;
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation
        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', sanitizeInput(name));
        formData.append('price', price);
        formData.append('description', sanitizeInput(description));
        formData.append('category_id', categoryId);
        formData.append('image', image);
        formData.append('developerId', user.id);

        try {
            const res = await axiosInstance.post('/games', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            dispatch(addGame(res.data));
            toast.success('Game added successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error adding game:', error);
            
            const errorData = error.response?.data;
            
            if (errorData?.errors) {
                Object.entries(errorData.errors).forEach(([field, message]) => {
                    toast.error(message);
                    setErrors(prev => ({ ...prev, [field]: message }));
                });
            } else if (errorData?.error) {
                toast.error(errorData.error);
            } else if (error.response?.status === 401) {
                toast.error('Unauthorized: Please log in again');
                navigate('/login');
            } else {
                toast.error('Failed to add game');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
            style={{
                backgroundColor: '#171a21',
            }}
        >
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-md mx-auto p-6 bg-gray-800 bg-opacity-95 rounded-xl shadow-lg text-white">
                        <h1 className="text-2xl font-bold mb-6 text-purple-400">Add New Game</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Field */}
                            <label className="block">
                                <span className="text-purple-300">Name: *</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={handleNameChange}
                                    className={`mt-1 w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 ${
                                        errors.name ? 'border-2 border-red-500' : 'focus:ring-purple-500'
                                    }`}
                                    disabled={isSubmitting}
                                    required
                                    maxLength="200"
                                />
                                {errors.name && (
                                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                                )}
                                <p className="text-gray-400 text-xs mt-1">Max 200 characters</p>
                            </label>

                            {/* Price Field */}
                            <label className="block">
                                <span className="text-purple-300">Price: *</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={price}
                                    onChange={handlePriceChange}
                                    className={`mt-1 w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 ${
                                        errors.price ? 'border-2 border-red-500' : 'focus:ring-purple-500'
                                    }`}
                                    disabled={isSubmitting}
                                    required
                                />
                                {errors.price && (
                                    <p className="text-red-400 text-sm mt-1">{errors.price}</p>
                                )}
                            </label>

                            {/* Description Field */}
                            <label className="block">
                                <span className="text-purple-300">Description:</span>
                                <textarea
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    className={`mt-1 w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 resize-none h-32 ${
                                        errors.description ? 'border-2 border-red-500' : 'focus:ring-purple-500'
                                    }`}
                                    disabled={isSubmitting}
                                    maxLength="2000"
                                />
                                {errors.description && (
                                    <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                                )}
                                <p className="text-gray-400 text-xs mt-1">
                                    {description.length}/2000 characters
                                </p>
                            </label>

                            {/* Category Field */}
                            <label className="block">
                                <span className="text-purple-300">Category: *</span>
                                <select
                                    value={categoryId}
                                    onChange={handleCategoryChange}
                                    className={`mt-1 w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 ${
                                        errors.categoryId ? 'border-2 border-red-500' : 'focus:ring-purple-500'
                                    }`}
                                    disabled={isSubmitting}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoryId && (
                                    <p className="text-red-400 text-sm mt-1">{errors.categoryId}</p>
                                )}
                            </label>

                            {/* Image Field */}
                            <label className="block">
                                <span className="text-purple-300">Image: *</span>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={handleImageChange}
                                    className={`mt-1 w-full bg-gray-700 text-white p-2 rounded-lg file:bg-blue-600 file:text-white file:border-none file:rounded file:px-3 file:py-1 ${
                                        errors.image ? 'border-2 border-red-500' : ''
                                    }`}
                                    disabled={isSubmitting}
                                    required
                                />
                                {errors.image && (
                                    <p className="text-red-400 text-sm mt-1">{errors.image}</p>
                                )}
                                <p className="text-gray-400 text-xs mt-1">
                                    Max 10MB. JPG, PNG, GIF, WebP allowed.
                                </p>
                            </label>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 ${
                                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSubmitting ? 'Adding Game...' : 'Add Game'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AddGame;