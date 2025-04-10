import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/authReducer';
import bcrypt from 'bcryptjs';

function Login() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/users?email=${email}`);
            const users = await response.json();

            if (users.length === 0) {
                alert('User not found');
                return;
            }

            const user = users[0];

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                dispatch(login(user));
                navigate('/dashboard');
             } else {
                alert('Invalid password');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed');
        }
    }

    return (
        <div className="container">
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-blue">Login</button>
            </form>
        </div>
    );
}

export default Login;