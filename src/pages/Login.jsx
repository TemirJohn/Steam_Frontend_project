import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/authReducer';

function Login() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        const response = await fetch(`http://localhost:3001/users?email=${email}&password=${password}`);
        const data = await response.json();
        if (data.length > 0) {
            dispatch(login(data[0]));
            navigate('/dashboard');
        } else {
            alert('Invalid credentials');
        }
    }

    return (
        <div className="container mx-auto p-4 max-w-md">
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border p-2 w-full mb-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border p-2 w-full mb-2"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
            </form>
        </div>
    );
}

export default Login;