import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../utils/axiosConfig';
import { updateGame } from '../redux/gameReducer';
import { toast } from 'react-toastify';

function EditGame() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [game, setGame] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'developer')) {
            toast.error('Access denied');
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        axios.get(`/games/${id}`)
            .then((res) => {
                const data = res.data;
                if (user.role === 'developer' && data.developerId !== user.id) {
                    toast.error('You can only edit your own games.');
                    navigate('/dashboard');
                } else {
                    setGame(data);
                    setName(data.name);
                    setPrice(data.price);
                    setDescription(data.description);
                }
            })
            .catch((error) => {
                console.error('Error fetching game:', error);
                toast.error('Failed to load game');
            });
    }, [id, user, navigate]);

    const handleSave = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        if (image) formData.append('image', image);

        try {
            const res = await axios.put(`/games/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            dispatch(updateGame(res.data));
            toast.success('Game updated successfully!');
            navigate(`/games/${id}`);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update game');
        }
    };

    if (!game) return (
        <div className="flex justify-center items-center h-screen text-white">
            <p className="text-xl">Loading game data...</p>
        </div>
    );

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
                        <h1 className="text-2xl font-bold mb-6 text-purple-400">Edit Game</h1>
                        <form onSubmit={handleSave} className="space-y-4">
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
                                <span className="text-purple-300">Image:</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    className="mt-1 w-full bg-gray-700 text-white p-2 rounded-lg file:bg-blue-600 file:text-white file:border-none file:rounded file:px-3 file:py-1"
                                />
                            </label>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default EditGame;