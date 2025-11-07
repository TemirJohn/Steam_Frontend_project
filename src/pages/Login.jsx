import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/authReducer';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';

function Login() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            dispatch(login(response.data.user));
            toast.success('Logged in successfully!');
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            
            // ОБНОВЛЕНО: Обработка ошибок валидации
            const errorData = error.response?.data;
            
            if (errorData?.errors) {
                // Множественные ошибки валидации
                Object.values(errorData.errors).forEach(err => {
                    toast.error(err);
                });
            } else if (errorData?.error) {
                // Единичная ошибка
                toast.error(errorData.error);
            } else {
                toast.error('Login failed');
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold mb-6 text-yellow-300">Login</h1>
            <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-gray-700">
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
                <button
                    type="submit"
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-full transition duration-200"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;