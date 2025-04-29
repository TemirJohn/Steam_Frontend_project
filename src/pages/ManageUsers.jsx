import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

Modal.setAppElement('#root');

function ManageUsers() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [users, setUsers] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            toast.error('Access denied! Only admins can manage users.');
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        axios.get('http://localhost:8080/users')
            .then((res) => setUsers(res.data))
            .catch((error) => {
                console.error('Error fetching users:', error);
                toast.error('Failed to load users');
            });
    }, []);

    async function handleDelete() {
        try {
            await axios.delete(`http://localhost:8080/users/${userToDelete.id}`);
            setUsers(users.filter((u) => u.id !== userToDelete.id));
            toast.success('User deleted successfully!');
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
        }
        setModalIsOpen(false);
    }

    const openModal = (user) => {
        setUserToDelete(user);
        setModalIsOpen(true);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Users (Admins Only)</h1>
            <ul className="space-y-2">
                {users.map((u) => (
                    <li key={u.id} className="flex justify-between items-center border-b py-2">
                        <span>{u.name} - {u.role} - {u.email}</span>
                        <button
                            onClick={() => openModal(u)}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                className="bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete {userToDelete?.name}?</p>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Yes, Delete
                    </button>
                    <button
                        onClick={() => setModalIsOpen(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default ManageUsers;