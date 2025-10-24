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
        <div
            className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
            style={{
                backgroundColor: '#171a21',
            }}
        >
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto p-6 bg-gray-800 bg-opacity-95 rounded-xl shadow-lg text-white">
                        <h1 className="text-2xl font-bold mb-6 text-purple-400">Manage Users (Admins Only)</h1>
                        <ul className="space-y-2">
                            {users.map((u) => (
                                <li
                                    key={u.id}
                                    className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
                                >
                                    <div className="flex items-center space-x-4">
                                        {u.avatar ? (
                                            <img
                                                src={`http://localhost:8080/${u.avatar}`}
                                                alt={u.name}
                                                className="w-10 h-10 rounded-full border border-green-500 object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-gray-300 border border-gray-500">
                                                {u.name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                        )}
                                        <span className="text-gray-300">
                                            <span className="text-green-400">{u.name}</span> - {u.role} - {u.email} -{' '}
                                            {u.isBanned ? (
                                                <span className="text-red-400">Banned</span>
                                            ) : (
                                                <span className="text-green-400">Active</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="space-x-2">
                                        {u.isBanned ? (
                                            <button
                                                onClick={() => handleUnban(u.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                                                aria-label={`Unban user ${u.name}`}
                                            >
                                                Unban
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleBan(u.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                                                aria-label={`Ban user ${u.name}`}
                                            >
                                                Ban
                                            </button>
                                        )}
                                        <button
                                            onClick={() => openRoleModal(u)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                                            aria-label={`Change role for ${u.name}`}
                                        >
                                            Change Role
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={() => setModalIsOpen(false)}
                            className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-md mx-auto mt-20 text-white"
                            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-purple-400">Confirm Deletion</h2>
                            <p className="text-gray-300">
                                Are you sure you want to delete{' '}
                                <strong className="text-green-400">{userToDelete?.name}</strong>?
                            </p>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={() => setModalIsOpen(false)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </Modal>

                        <Modal
                            isOpen={roleModalIsOpen}
                            onRequestClose={() => setRoleModalIsOpen(false)}
                            className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-md mx-auto mt-20 text-white"
                            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-purple-400">
                                Change Role for <span className="text-green-400">{userToUpdateRole?.name}</span>
                            </h2>
                            <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                                aria-label="Select new role"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="developer">Developer</option>
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={handleRoleChange}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                                >
                                    Update Role
                                </button>
                                <button
                                    onClick={() => setRoleModalIsOpen(false)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </Modal>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ManageUsers;