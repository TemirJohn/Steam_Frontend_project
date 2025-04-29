import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import GameCard from '../components/GameCard';
import { toast } from 'react-toastify';

function Home() {
    const user = useSelector((state) => state.auth.user);
    const [games, setGames] = useState([]);
    const [ownedGames, setOwnedGames] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category') || 'all';

    useEffect(() => {
        axios.get(`/games?categoryId=${categoryFilter === 'all' ? '' : categoryFilter}`)
            .then((res) => setGames(res.data))
            .catch((err) => {
                console.error('Error fetching games:', err);
                toast.error('Failed to load games');
            });
        if (user) {
            axios.get('/library')
                .then((res) => setOwnedGames(res.data))
                .catch((err) => {
                    console.error('Error fetching library:', err);
                    toast.error('Failed to load library');
                });
        }
    }, [user, categoryFilter]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome to SteamLite</h1>
            {user ? (
                <p className="mb-4">
                    Hello, {user.name}! You are logged in as <strong>{user.role}</strong>.
                </p>
            ) : (
                <p className="mb-4">Please log in to access more features.</p>
            )}
            <h2 className="text-xl font-semibold mb-2">Games</h2>
            <div className="mb-4 space-x-2">
                <button
                    onClick={() => setSearchParams({})}
                    className="bg-gray-200 px-4 py-2 rounded"
                >
                    All
                </button>
                <button
                    onClick={() => setSearchParams({ category: '1' })}
                    className="bg-gray-200 px-4 py-2 rounded"
                >
                    Action
                </button>
                <button
                    onClick={() => setSearchParams({ category: '2' })}
                    className="bg-gray-200 px-4 py-2 rounded"
                >
                    RPG
                </button>
                <button
                    onClick={() => setSearchParams({ category: '3' })}
                    className="bg-gray-200 px-4 py-2 rounded"
                >
                    Strategy
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
}

export default Home;