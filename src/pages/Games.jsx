import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

function Games() {
    const [games, setGames] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryId = searchParams.get('categoryId') || 'all';
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const url = categoryId === 'all' ? '/games' : `/games?categoryId=${categoryId}`;
        axios
            .get(url)
            .then((res) => setGames(res.data))
            .catch((err) => console.error('Error fetching games:', err));
    }, [categoryId]);

    const handleBuy = async (gameId) => {
        if (!user) return alert('Please log in to buy games.');
        try {
            await axios.post(
                '/ownership',
                { gameId, status: 'owned' },
                { headers: { 'User-ID': user.id } }
            );
            alert('Game purchased!');
        } catch (error) {
            console.error('Error purchasing game:', error);
            alert('Failed to purchase game');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Game Catalog</h1>
            <div className="mb-4 space-x-2">
                <button
                    onClick={() => setSearchParams({})}
                    className="bg-gray-200 px-4 py-2 rounded"
                >
                    All
                </button>
                <button
                    onClick={() => setSearchParams({ categoryId: '1' })}
                    className="bg-gray-200 px-4 py-2 rounded"
                >
                    Action
                </button>
                <button
                    onClick={() => setSearchParams({ categoryId: '2' })}
                    className="bg-gray-200 px-4 py-2 rounded"
                >
                    RPG
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map((game) => (
                    <div key={game.id} className="p-4 bg-gray-100 rounded shadow">
                        <h3 className="text-lg font-semibold">{game.name}</h3>
                        <p>${game.price.toFixed(2)}</p>
                        <p className="text-gray-600">{game.description}</p>
                        {user && user.role !== 'admin' && (
                            <button
                                onClick={() => handleBuy(game.id)}
                                className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Buy
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Games;