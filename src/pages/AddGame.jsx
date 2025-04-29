import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
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

        axios.get('http://localhost:8080/categories')
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
        formData.append('developerId', user.id); // Добавляем developerId

        try {
            const res = await axios.post('/games', formData, {
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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add New Game</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                <label className="block">
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    />
                </label>
                <label className="block">
                    Price:
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    />
                </label>
                <label className="block">
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </label>
                <label className="block">
                    Category:
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="border p-2 rounded w-full"
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
                    Image:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="border p-2 rounded w-full"
                        required
                    />
                </label>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Add Game
                </button>
            </form>
        </div>
    );
}

export default AddGame;