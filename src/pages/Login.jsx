import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/authReducer';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';
import { validateEmail, validatePassword, sanitizeInput } from '../utils/validation';

function Login() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Real-time validation
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        
        // Clear error when user starts typing
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: null }));
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: null }));
        }
    };

    // Validate form before submission
    const validateForm = () => {
        const newErrors = {};
        
        const emailError = validateEmail(email);
        if (emailError) newErrors.email = emailError;
        
        const passwordError = validatePassword(password);
        if (passwordError) newErrors.password = passwordError;
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleLogin(e) {
        e.preventDefault();
        
        // Frontend validation
        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        setIsSubmitting(true);

        try {
            // Sanitize inputs
            const sanitizedEmail = sanitizeInput(email);
            const sanitizedPassword = sanitizeInput(password);

            const response = await axiosInstance.post('/login', {
                email: sanitizedEmail,
                password: sanitizedPassword
            });
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            dispatch(login(response.data.user));
            toast.success('Logged in successfully!');
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            
            const errorData = error.response?.data;
            
            if (errorData?.errors) {
                // Backend validation errors
                Object.entries(errorData.errors).forEach(([field, message]) => {
                    toast.error(message);
                    setErrors(prev => ({ ...prev, [field]: message }));
                });
            } else if (errorData?.error) {
                toast.error(errorData.error);
            } else {
                toast.error('Login failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold mb-6 text-yellow-300">Login</h1>
            <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-gray-700">
                {/* Email Field */}
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                        className={`bg-gray-700 border ${
                            errors.email ? 'border-red-500' : 'border-gray-600'
                        } p-2 rounded w-full focus:outline-none focus:ring-2 ${
                            errors.email ? 'focus:ring-red-500' : 'focus:ring-yellow-400'
                        }`}
                        disabled={isSubmitting}
                        required
                    />
                    {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        className={`bg-gray-700 border ${
                            errors.password ? 'border-red-500' : 'border-gray-600'
                        } p-2 rounded w-full focus:outline-none focus:ring-2 ${
                            errors.password ? 'focus:ring-red-500' : 'focus:ring-yellow-400'
                        }`}
                        disabled={isSubmitting}
                        required
                    />
                    {errors.password && (
                        <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-full transition duration-200 ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;