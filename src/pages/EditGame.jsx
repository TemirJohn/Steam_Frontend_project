// src/pages/EditGame.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function EditGame() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const [game, setGame] = useState(null);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'developer')) {
            alert('Access denied');
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        fetch(`http://localhost:8080/games/${id}`)
            .then(res => res.json())
            .then(data => {
                setGame(data);
                setTitle(data.title);
                setPrice(data.price);
                setDescription(data.description);
            });

        fetch(`http://localhost:8080/games/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.text();
            })
            .then((text) => {
                console.log('Raw game response:', text);
                const data = JSON.parse(text);
                if (user.role === 'developer' && data.developerId !== user.id) {
                    alert('You can only edit your own games.');
                    navigate('/dashboard');
                } else {
                    setGame(data);
                }
            })
            .catch((error) => console.error('Error fetching game:', error));

    }, [id, user, navigate]);



    const handleSave = async (e) => {
        e.preventDefault();

        const updatedGame = {
            ...game,
            title,
            price: Number(price),
            description
        };

        try {
            const res = await fetch(`http://localhost:8080/games/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedGame),
            });

            if (res.ok) {
                alert('Game updated successfully!');
                navigate(`/games/${id}`);
            } else {
                alert('Failed to update game');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (!game) return <div>Loading...</div>;

    return (
        <div className="container">
            <h1 >Edit Game</h1>
            <form onSubmit={handleSave}>
                <label>
                    Title:
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label>
                    Price:
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </label>
                <label>
                    Description:
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                <button type="submit" className="btn btn-blue">Save</button>
                <button type="button" className="btn btn-grey" onClick={() => navigate(-1)}>Cancel</button>
            </form>
        </div>
    );
}

export default EditGame;