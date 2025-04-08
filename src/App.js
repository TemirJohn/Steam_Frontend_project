import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
// import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
// import Games from './pages/Games';
import GameDetail from './pages/GameDetail';
// import AddGame from './pages/AddGame';
import ManageUsers from './pages/ManageUsers';

function App() {
    const user = useSelector((state) => state.auth.user);

    return (
        <BrowserRouter>
            {/*<Navbar />*/}
            <Routes>
                {/*<Route path="/" element={<Home />} />*/}
                <Route path="/login" element={<Login />} />
                {/*<Route path="/register" element={<Register />} />*/}
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                {/*<Route path="/games" element={<Games />} />*/}
                <Route path="/games/:id" element={<GameDetail />} />
                {/*<Route path="/add-game" element={user ? <AddGame /> : <Navigate to="/dashboard" />} />*/}
                <Route path="/manage-users" element={user ? <ManageUsers /> : <Navigate to="/dashboard" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;