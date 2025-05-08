import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
            const response = await axios.post('http://localhost:8080/users', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Registered successfully! Please log in.');
            navigate('/login');
        } catch (error) {
            console.error('Error registering:', error);
            toast.error(error.response?.data?.error || 'Error during registration');
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <form onSubmit={handleRegister} className="max-w-md mx-auto space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    className="border p-2 rounded w-full"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;