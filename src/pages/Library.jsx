import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

function Library() {
    const [ownedGames, setOwnedGames] = useState([]);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (user) {
            axios
                .get('/library')
                .then((res) => setOwnedGames(res.data))
                .catch((err) => console.error('Error fetching library:', err));
        }
    }, [user]);

    if (!user) {
        return <div>Please log in to view your library.</div>;
    }


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">My Library</h1>
            {!user ? (
                <p>Please log in to view your library.</p>
            ) : ownedGames.length === 0 ? (
                <p>No games in your library yet.</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ownedGames.map((game) => (
                        <li key={game.id} className="p-4 bg-gray-100 rounded shadow">
                            <h3 className="text-lg font-semibold">{game.name}</h3>
                            <p>${game.price.toFixed(2)}</p>
                            <p className="text-gray-600">{game.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Library;