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
    const [roleModalIsOpen, setRoleModalIsOpen] = useState(false);
    const [userToUpdateRole, setUserToUpdateRole] = useState(null);
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            toast.error('Access denied! Only admins can manage users.');
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        axios.get('http://localhost:8080/users')
            .then((res) => {
                // Фильтруем список, исключая текущего пользователя (админа)
                const filteredUsers = res.data.filter((u) => u.id !== user.id);
                setUsers(filteredUsers);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
                toast.error('Failed to load users');
            });
    }, [user]);

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

    async function handleBan(userId) {
        try {
            const res = await axios.post(`http://localhost:8080/users/${userId}/ban`);
            setUsers(users.map((u) => (u.id === userId ? res.data.user : u)));
            toast.success('User banned successfully!');
        } catch (error) {
            console.error('Error banning user:', error);
            toast.error('Failed to ban user');
        }
    }

    async function handleUnban(userId) {
        try {
            const res = await axios.post(`http://localhost:8080/users/${userId}/unban`);
            setUsers(users.map((u) => (u.id === userId ? res.data.user : u)));
            toast.success('User unbanned successfully!');
        } catch (error) {
            console.error('Error unbanning user:', error);
            toast.error('Failed to unban user');
        }
    }

    async function handleRoleChange() {
        if (!newRole) {
            toast.error('Please select a role');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('role', newRole);
            const res = await axios.put(`http://localhost:8080/users/${userToUpdateRole.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUsers(users.map((u) => (u.id === userToUpdateRole.id ? res.data : u)));
            toast.success('Role updated successfully!');
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('Failed to update role');
        }
        setRoleModalIsOpen(false);
        setNewRole('');
    }

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setModalIsOpen(true);
    };

    const openRoleModal = (user) => {
        setUserToUpdateRole(user);
        setNewRole(user.role);
        setRoleModalIsOpen(true);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Users (Admins Only)</h1>
            <ul className="space-y-2">
                {users.map((u) => (
                    <li key={u.id} className="flex justify-between items-center border-b py-2">
                        <span>
                            {u.name} - {u.role} - {u.email} - {u.isBanned ? 'Banned' : 'Active'}
                        </span>
                        <div className="space-x-2">
                            {u.isBanned ? (
                                <button
                                    onClick={() => handleUnban(u.id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Unban
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleBan(u.id)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                                >
                                    Ban
                                </button>
                            )}
                            <button
                                onClick={() => openRoleModal(u)}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Change Role
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Модальное окно для удаления */}
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

            {/* Модальное окно для изменения роли */}
            <Modal
                isOpen={roleModalIsOpen}
                onRequestClose={() => setRoleModalIsOpen(false)}
                className="bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <h2 className="text-xl font-semibold mb-4">Change Role for {userToUpdateRole?.name}</h2>
                <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="border p-2 rounded w-full mb-4"
                >
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="developer">Developer</option>
                </select>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={handleRoleChange}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Update Role
                    </button>
                    <button
                        onClick={() => setRoleModalIsOpen(false)}
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