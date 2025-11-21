import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';
import {
    validateEmail,
    validatePassword,
    validateUsername,
    validateImageFile,
    sanitizeInput
} from '../utils/validation';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Real-time validation handlers
    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        if (errors.username) {
            setErrors(prev => ({ ...prev, username: null }));
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
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

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        
        // Validate image immediately
        if (file) {
            const imageError = validateImageFile(file);
            if (imageError) {
                setErrors(prev => ({ ...prev, avatar: imageError }));
                setAvatar(null);
                e.target.value = ''; // Clear file input
            } else {
                setErrors(prev => ({ ...prev, avatar: null }));
            }
        }
    };

    // Validate entire form
    const validateForm = () => {
        const newErrors = {};
        
        const usernameError = validateUsername(username);
        if (usernameError) newErrors.username = usernameError;
        
        const emailError = validateEmail(email);
        if (emailError) newErrors.email = emailError;
        
        const passwordError = validatePassword(password);
        if (passwordError) newErrors.password = passwordError;
        
        // Avatar is optional, but if provided, must be valid
        if (avatar) {
            const avatarError = validateImageFile(avatar);
            if (avatarError) newErrors.avatar = avatarError;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleRegister(e) {
        e.preventDefault();

        // Frontend validation
        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('username', sanitizeInput(username));
        formData.append('email', sanitizeInput(email));
        formData.append('password', sanitizeInput(password));
        formData.append('role', 'user');
        
        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            await axiosInstance.post('/users', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Registered successfully! Please log in.');
            navigate('/login');
        } catch (error) {
            console.error('Error registering:', error);
            
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
                toast.error('Registration failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold mb-6 text-yellow-300">Register</h1>
            <form onSubmit={handleRegister} className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-gray-700">
                {/* Username Field */}
                <div>
                    <input
                        type="text"
                        placeholder="Username (3-50 characters)"
                        value={username}
                        onChange={handleUsernameChange}
                        className={`bg-gray-700 border ${
                            errors.username ? 'border-red-500' : 'border-gray-600'
                        } p-2 rounded w-full focus:outline-none focus:ring-2 ${
                            errors.username ? 'focus:ring-red-500' : 'focus:ring-yellow-400'
                        }`}
                        disabled={isSubmitting}
                        required
                    />
                    {errors.username && (
                        <p className="text-red-400 text-sm mt-1">{errors.username}</p>
                    )}
                </div>

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
                        placeholder="Password (min 6 characters)"
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
                    <p className="text-gray-400 text-xs mt-1">
                        Password requirements: 6-100 characters
                    </p>
                </div>

                {/* Avatar Field */}
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className={`bg-gray-700 border ${
                            errors.avatar ? 'border-red-500' : 'border-gray-600'
                        } p-2 rounded w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-500`}
                        disabled={isSubmitting}
                    />
                    {errors.avatar && (
                        <p className="text-red-400 text-sm mt-1">{errors.avatar}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                        Optional. Max 10MB. JPG, PNG, GIF, WebP allowed.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-full transition duration-200 ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isSubmitting ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}

export default Register;