import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authReducer';

function DeleteCard() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'developer')) {
            alert('Access denied! Only developers can delete games.');
            dispatch(logout());
            navigate('/login');
            return;
        }

        fetch(`http://localhost:8080/games/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.text();
            })
            .then((text) => {
                const data = JSON.parse(text);
                if (user.role === 'developer' && data.developerId !== user.id) {
                    alert('You can only delete your own games.');
                    navigate('/dashboard');
                } else {
                    setGame(data);
                }
            })
            .catch((error) => console.error('Error fetching game:', error));
    }, [id, user, dispatch, navigate]);

    async function handleDelete() {
        try {
            const response = await fetch(`http://localhost:8080/games/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Game deleted successfully!');
                navigate('/dashboard');
            } else {
                throw new Error('Failed to delete game');
            }
        } catch (error) {
            console.error('Error deleting game:', error);
            alert('Error deleting game. Check console for details.');
        }
    }

    if (!game) return <div>Loading...</div>;

    return (
        <div className="container">
            <h1>Delete Game</h1>
            <p>Are you sure you want to delete "{game.title}"?</p>
            <p>This action cannot be undone.</p>
            <button onClick={handleDelete} className="btn btn-red">Confirm Delete</button>
            <button onClick={() => navigate('/dashboard')} className="btn btn-gray">Cancel</button>
        </div>
    );
}

export default DeleteCard;