import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { useEffect } from 'react';
import { fetchCSRFToken } from './config/axiosConfig'; 
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import AddGame from './pages/AddGame';
import EditGame from './pages/EditGame';
import DeleteCard from './pages/DeleteCard';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from "./pages/Profile";
import ManageCategories from "./pages/ManageCategories";
import GameDetailAdvanced from './pages/GameDetailAdvanced';

function ProtectedRoute({ children, allowedRoles }) {
    const user = useSelector((state) => state.auth.user);
    if (!user) {
        return <Navigate to="/login" />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" />;
    }
    return children;
}

function App() {

    useEffect(() => {
        const initCSRF = async () => {
            try {
                await fetchCSRFToken();
                console.log('✅ CSRF token initialized');
            } catch (error) {
                console.error('❌ Failed to initialize CSRF token:', error);
            }
        };

        initCSRF();
    }, []);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/games/:id" element={<GameDetail />} />
                        
                        <Route 
                            path="/games/:id/advanced" 
                            element={
                                <ProtectedRoute>
                                    <GameDetailAdvanced />
                                </ProtectedRoute>
                            } 
                        />
                        
                        <Route
                            path="/add-game"
                            element={
                                <ProtectedRoute allowedRoles={['admin', 'developer']}>
                                    <AddGame />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/games/:id/edit"
                            element={
                                <ProtectedRoute allowedRoles={['admin', 'developer']}>
                                    <EditGame />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/delete-game/:id"
                            element={
                                <ProtectedRoute allowedRoles={['admin', 'developer']}>
                                    <DeleteCard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/manage-users"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <ManageUsers />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute allowedRoles={['user', 'admin', 'developer']}>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/manage-categories" element={<ManageCategories />} />
                    </Routes>
                    <ToastContainer />

                </BrowserRouter>
            </PersistGate>
        </Provider>
    );
}

export default App;