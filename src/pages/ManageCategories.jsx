import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosConfig';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { deleteGame } from '../redux/gameReducer';

Modal.setAppElement('#root');

function ManageCategories() {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            toast.error('Access denied');
            navigate('/login');
            return;
        }

        fetchCategories();
    }, [user, navigate]);

    const fetchCategories = async () => {
        try {
            const res = await axiosInstance.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            if (err.response?.status === 401) {
                toast.error('Unauthorized: Please log in again');
                navigate('/login');
            } else {
                toast.error('Failed to load categories');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Category name is required');
            return;
        }

        try {
            if (editingCategoryId) {
                const res = await axiosInstance.put(`/categories/${editingCategoryId}`, { name });
                setCategories(categories.map((cat) => (cat.id === editingCategoryId ? res.data : cat)));
                toast.success('Category updated successfully!');
                setEditingCategoryId(null);
            } else {
                const res = await axiosInstance.post('/categories', { name });
                setCategories([...categories, res.data]);
                toast.success('Category added successfully!');
            }
            setName('');
        } catch (error) {
            console.error('Error saving category:', error);
            if (error.response?.status === 401) {
                toast.error('Unauthorized: Please log in again');
                navigate('/login');
            } else if (error.response?.status === 403) {
                toast.error('Admins only');
            } else {
                toast.error('Failed to save category');
            }
        }
    };

    const handleEdit = (category) => {
        setName(category.name);
        setEditingCategoryId(category.id);
    };

    const openDeleteModal = (category) => {
        setCategoryToDelete(category);
        setDeleteModalIsOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await axiosInstance.delete(`/categories/${categoryToDelete.id}`);
            setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id));
            // Dispatch deleteGame for each deleted game
            if (res.data.deletedGameIds && res.data.deletedGameIds.length > 0) {
                res.data.deletedGameIds.forEach((gameId) => {
                    dispatch(deleteGame(Number(gameId)));
                });
                toast.success(
                    `Category "${categoryToDelete.name}" and ${res.data.deletedGameIds.length} associated game(s) deleted successfully!`
                );
            } else {
                toast.success(`Category "${categoryToDelete.name}" deleted successfully!`);
            }
        } catch (err) {
            console.error('Error deleting category:', err);
            if (err.response?.status === 401) {
                toast.error('Unauthorized: Please log in again');
                navigate('/login');
            } else if (err.response?.status === 403) {
                toast.error('Admins only');
            } else {
                toast.error('Failed to delete category');
            }
        }
        setDeleteModalIsOpen(false);
        setCategoryToDelete(null);
    };

    const handleCancelDelete = () => {
        setDeleteModalIsOpen(false);
        setCategoryToDelete(null);
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
                    <div className="max-w-md mx-auto p-6 bg-gray-800 bg-opacity-95 rounded-xl shadow-lg text-white">
                        <h1 className="text-2xl font-bold mb-6 text-purple-400">
                            {editingCategoryId ? 'Update Category' : 'Add New Category'}
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                            <label htmlFor="categoryName" className="block">
                                <span className="text-purple-300">Category Name:</span>
                                <input
                                    id="categoryName"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                    aria-label="Category name"
                                />
                            </label>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                                aria-label={editingCategoryId ? 'Update category' : 'Add category'}
                            >
                                {editingCategoryId ? 'Update Category' : 'Add Category'}
                            </button>
                            {editingCategoryId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingCategoryId(null);
                                        setName('');
                                    }}
                                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                                    aria-label="Cancel editing"
                                >
                                    Cancel
                                </button>
                            )}
                        </form>

                        <h2 className="text-xl font-bold mb-4 text-purple-400">Existing Categories</h2>
                        {categories.length === 0 ? (
                            <p className="text-gray-300">No categories found.</p>
                        ) : (
                            <ul className="space-y-2">
                                {categories.map((category) => (
                                    <li
                                        key={category.id}
                                        className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
                                    >
                                        <span className="text-green-400">{category.name}</span>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded-lg transition-all duration-200"
                                                aria-label={`Edit category ${category.name}`}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(category)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg transition-all duration-200"
                                                aria-label={`Delete category ${category.name}`}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <Modal
                            isOpen={deleteModalIsOpen}
                            onRequestClose={handleCancelDelete}
                            className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-md mx-auto mt-20 text-white"
                            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                        >
                            <h2 className="text-2xl font-bold mb-4 text-purple-400">Delete Category</h2>
                            <p className="mb-2">
                                Are you sure you want to delete{' '}
                                <strong className="text-green-400">{categoryToDelete?.name}</strong>?
                            </p>
                            <p className="text-gray-300 mb-6">
                                This will also delete all associated games. This action cannot be undone.
                            </p>

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={confirmDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                                    aria-label={`Delete category ${categoryToDelete?.name}`}
                                >
                                    Confirm Delete
                                </button>
                                <button
                                    onClick={handleCancelDelete}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                                    aria-label="Cancel deletion"
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

export default ManageCategories;