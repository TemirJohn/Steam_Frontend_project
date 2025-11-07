import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../config/axiosConfig';
import { buildAssetUrl } from '../utils/url';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setUser } from '../redux/authReducer';

function Profile() {
    const user = useSelector((state) => state.auth.user);
    const [library, setLibrary] = useState([]);
    const [avatar, setAvatar] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user) return;

        axiosInstance.get('/library')
            .then((res) => {
                setLibrary(res.data || []);
            })
            .catch((err) => {
                console.error('Error fetching library:', err);
                toast.error('Failed to load your games');
            });
    }, [user]);

    const handleAvatarUpload = async () => {
        if (!avatar) {
            toast.error('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', avatar);

        try {
            const res = await axiosInstance.put(`/users/${user.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            dispatch(setUser({ ...user, avatar: res.data.avatar }));
            toast.success('Avatar updated!');
        } catch (err) {
            console.error('Error uploading avatar:', err.response?.data);
            toast.error(err.response?.data?.error || 'Failed to update avatar');
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <p className="text-white text-xl">Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed text-white"
            style={{
                backgroundColor: '#171a21',
            }}
        >
            <div className="max-w-5xl mx-auto p-6">
                {/* User info */}
                <div className="bg-gray-800 bg-opacity-90 shadow-xl rounded-2xl p-8 mb-10">
                    <h1 className="text-4xl font-bold text-purple-600 mb-4">Profile</h1>
                    {user.avatar ? (
                        <img
                            src={buildAssetUrl(user.avatar)}
                            alt="Avatar"
                            className="w-28 h-28 rounded-full object-cover border-4 border-purple-500"
                            onError={(e) => console.error('Failed to load avatar:', e)}
                        />
                    ) : (
                        <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 border-2 border-gray-500">
                            No Avatar
                        </div>
                    )}
                    <div className="mt-5">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatar(e.target.files[0])}
                            className="mb-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-gray-900 hover:file:bg-purple-700"
                        />
                        <button
                            onClick={handleAvatarUpload}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
                        >
                            Upload New Avatar
                        </button>
                    </div>
                    <p className="mt-4">👤 <strong>Name:</strong> {user.name}</p>
                    <p>📧 <strong>Email:</strong> {user.email || 'Not provided'}</p>
                    <p>🎮 <strong>Role:</strong> {user.role}</p>
                </div>

                {/* Library */}
                <div className="bg-gray-800 bg-opacity-90 shadow-xl rounded-2xl p-8">
                    <h2 className="text-3xl font-semibold text-green-400 mb-6">Your Game Library</h2>
                    {library.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {library.map((game) => (
                                <Link key={game.id} to={`/games/${game.id}`} className="block">
                                    <div className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl shadow-lg transition-all">
                                        <img
                                            src={buildAssetUrl(game.image)}
                                            alt={game.name}
                                            className="w-full h-40 object-cover rounded mb-3"
                                        />
                                        <h3 className="text-lg font-bold text-white">{game.name}</h3>
                                        <p className="text-green-300">${game.price.toFixed(2)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-300">You have not purchased any games yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;