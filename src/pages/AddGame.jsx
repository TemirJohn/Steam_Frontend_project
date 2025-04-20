import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authReducer';
import axios from '../axios';

function AddGame() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            alert('Access denied! Only admins can add games.');
            dispatch(logout());
            navigate('/login');
        }
    }, [user, navigate, dispatch]);

    useEffect(() => {
        axios
            .get('/categories')
            .then((res) => {
                setCategories(res.data);
                if (res.data.length > 0) setCategoryId(res.data[0].id);
            })
            .catch((err) => console.error('Failed to load categories:', err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !price || !categoryId) {
            alert('Please fill in all required fields.');
            return;
        }
        try {
            const newGame = {
                name,
                price: parseFloat(price),
                description,
                categoryId: parseInt(categoryId),
            };
            await axios.post('/games', newGame, {
                headers: { 'User-ID': user.id },
            });
            alert('Game added!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error adding game:', error);
            alert('Failed to add game');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add Game (Admins Only)</h1>
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
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Add Game
                </button>
            </form>
        </div>
    );
}

export default AddGame;