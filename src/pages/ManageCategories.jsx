import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';

function ManageCategories() {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const user = useSelector((state) => state.auth.user);
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
            const res = await axios.get('http://localhost:8080/categories');
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
                // Update category
                const res = await axios.put(`/categories/${editingCategoryId}`, { name });
                setCategories(categories.map((cat) => (cat.id === editingCategoryId ? res.data : cat)));
                toast.success('Category updated successfully!');
                setEditingCategoryId(null);
            } else {
                // Add new category
                const res = await axios.post('/categories', { name });
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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await axios.delete(`/categories/${id}`);
            setCategories(categories.filter((cat) => cat.id !== id));
            toast.success('Category deleted successfully!');
        } catch (error) {
            console.error('Error deleting category:', error);
            if (error.response?.status === 401) {
                toast.error('Unauthorized: Please log in again');
                navigate('/login');
            } else if (error.response?.status === 403) {
                toast.error('Admins only');
            } else {
                toast.error('Failed to delete category');
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                {editingCategoryId ? 'Update Category' : 'Add New Category'}
            </h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mb-8">
                <label className="block">
                    Category Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    />
                </label>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
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
                        className="bg-gray-500 text-white px-4 py-2 rounded w-full"
                    >
                        Cancel
                    </button>
                )}
            </form>

            <h2 className="text-xl font-bold mb-4">Existing Categories</h2>
            {categories.length === 0 ? (
                <p className="text-gray-600">No categories found.</p>
            ) : (
                <ul className="space-y-2 max-w-md mx-auto">
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            className="flex justify-between items-center border p-2 rounded"
                        >
                            <span>{category.name}</span>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ManageCategories;