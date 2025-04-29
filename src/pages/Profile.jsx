import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../utils/axiosConfig';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Profile() {
    const user = useSelector((state) => state.auth.user);
    const [library, setLibrary] = useState([]);

    useEffect(() => {
        if (!user) return;

        axios.get('/library')
            .then((res) => {
                setLibrary(res.data);
            })
            .catch((err) => {
                console.error('Error fetching library:', err);
                toast.error('Failed to load your games');
            });
    }, [user]);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-600 text-xl">Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* User info */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                <h1 className="text-3xl font-bold mb-2">Profile</h1>
                <p className="text-gray-700">👤 <strong>Name:</strong> {user.name}</p>
                <p className="text-gray-700">📧 <strong>Email:</strong> {user.email || 'Not provided'}</p>
                <p className="text-gray-700">🎮 <strong>Role:</strong> {user.role}</p>
            </div>

            {/* Library */}
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Your Game Library</h2>
                {library.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {library.map((game) => (
                            <Link key={game.id} to={`/games/${game.id}`} className="block">
                                <div className="bg-gray-100 p-4 rounded-lg hover:shadow-lg transition">
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/${game.image}`}
                                        alt={game.name}
                                        className="w-full h-40 object-cover rounded mb-2"
                                    />
                                    <h3 className="text-lg font-bold">{game.name}</h3>
                                    <p className="text-gray-600">${game.price.toFixed(2)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">You have not purchased any games yet.</p>
                )}
            </div>
        </div>
    );
}

export default Profile;