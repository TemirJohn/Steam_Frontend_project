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

        const updatedGame = {
            name,
            price: Number(price),
            description,
        };

        try {
            const res = await axios.put(`/games/${id}`, updatedGame);
            dispatch(updateGame(res.data));
            toast.success('Game updated successfully!');
            navigate(`/games/${id}`);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update game');
        }
    };

    if (!game) return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-gray-600 text-xl">Loading game data...</p>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Game</h1>
            <form onSubmit={handleSave} className="max-w-md mx-auto space-y-4">
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
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Save
                </button>
                <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded w-full"
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditGame;