import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GameCard from '../components/GameCard';

function Games() {
    const [games, setGames] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category') || 'all';

    useEffect(() => {
        let url = 'http://localhost:3001/games';
        if (categoryFilter !== 'all') {
            url += `?categoryId=${categoryFilter}`;
        }

        fetch(url)
            .then((res) => res.json())
            .then((data) => setGames(data))
            .catch((error) => console.error('Error fetching games:', error));
    }, [categoryFilter]);

    return (
        <div className="container">
            <h1>Games</h1>
            <button
                onClick={() => setSearchParams({})}
                className="btn btn-gray"
            >
                All
            </button>
            <button
                onClick={() => setSearchParams({ category: '1' })}
                className="btn btn-gray"
            >
                Action
            </button>
            <button
                onClick={() => setSearchParams({ category: '2' })}
                className="btn btn-gray"
            >
                RPG
            </button>
            <div className="grid">
                {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
}

export default Games;