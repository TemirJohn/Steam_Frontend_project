import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authReducer';

function AddGame() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (!user || (user.role !== 'developer' && user.role !== 'admin')) {
            alert('Access denied! Only developers can add games.');
            dispatch(logout());
            navigate('/login');
        }
    }, [user, navigate, dispatch]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('http://localhost:3001/categories');
                const data = await response.json();
                setCategories(data);
                if (data.length > 0) {
                    setCategoryId(data[0].id);
                }
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        }

        fetchCategories();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!title || !price || !categoryId) {
            alert('Please fill in all required fields.');
            return;
        }

        const newGame = {
            title,
            price: Number(price),
            description,
            categoryId: Number(categoryId),
            developerId: user.id,
        };

        try {
            const response = await fetch('http://localhost:3001/games', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGame),
            });
            if (response.ok) {
                alert('Game added successfully!');
                navigate('/dashboard');
            } else {
                alert('Failed to add game.');
            }
        } catch (error) {
            console.error('Error adding game:', error);
        }
    }

    return (
        <div className="container">
            <h1>Add Game (Developers Only)</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>
                <label>
                    Price:
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                <label>
                    Category:
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit" className="btn btn-blue">Add Game</button>
            </form>
        </div>
    );
}

export default AddGame;