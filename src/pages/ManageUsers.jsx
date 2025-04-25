import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authReducer';

function ManageUsers() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            alert('Access denied! Only admins can manage users.');
            dispatch(logout());
            navigate('/login');
        }
    }, [user, navigate, dispatch]);

    useEffect(() => {
        fetch('http://localhost:8080/users')
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error('Error fetching users:', error));
    }, []);

    async function handleDelete(id) {
        try {
            const response = await fetch(`http://localhost:8080/users/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setUsers(users.filter((u) => u.id !== id));
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    return (
        <div className="container">
            <h1>Manage Users (Admins Only)</h1>
            <ul>
                {users.map((u) => (
                    <li key={u.id}>
                        <span>{u.username} - {u.role} - {u.email}</span>
                        <button
                            onClick={() => handleDelete(u.id)}
                            className="btn btn-red"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ManageUsers;