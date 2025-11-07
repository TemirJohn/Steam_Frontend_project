import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', 'user');
        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            const response = await axiosInstance.post('/users', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Registered successfully! Please log in.');
            navigate('/login');
        } catch (error) {
            console.error('Error registering:', error);
            
            const errorData = error.response?.data;
            
            if (errorData?.errors) {
                Object.values(errorData.errors).forEach(err => {
                    toast.error(err);
                });
            } else if (errorData?.error) {
                toast.error(errorData.error);
            } else {
                toast.error('Error during registration');
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold mb-6 text-yellow-300">Register</h1>
            <form onSubmit={handleRegister} className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-gray-700">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-700 border border-gray-600 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700 border border-gray-600 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-700 border border-gray-600 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    className="bg-gray-700 border border-gray-600 p-2 rounded w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-500"
                />
                <button
                    type="submit"
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-full transition duration-200"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;