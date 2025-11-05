import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { addGame } from '../redux/gameReducer';
import { toast } from 'react-toastify';

function AddGame() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'developer')) {
            toast.error('Access denied');
            navigate('/login');
            return;
        }

        axiosInstance.get('http://localhost:8080/categories')
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            toast.error('Please select an image');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
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
            if (error.response?.status === 401) {
                toast.error('Unauthorized: Please log in again');
                navigate('/login');
            } else {
                toast.error('Failed to add game');
            }
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
                            <label className="block">
                                <span className="text-purple-300">Name:</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className="text-purple-300">Price:</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="mt-1 w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className="text-purple-300">Description:</span>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1 w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-32"
                                />
                            </label>
                            <label className="block">
                                <span className="text-purple-300">Category:</span>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="mt-1 w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-purple-300">Image:</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    className="mt-1 w-full bg-gray-700 text-white p-2 rounded-lg file:bg-blue-600 file:text-white file:border-none file:rounded file:px-3 file:py-1"
                                    required
                                />
                            </label>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                            >
                                Add Game
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AddGame;