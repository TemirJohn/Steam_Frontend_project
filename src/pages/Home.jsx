import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { axios } from '../utils/axios';
import GameCard from '../components/GameCard';

function Home() {
    const user = useSelector((state) => state.auth.user);
    const [games, setGames] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category') || 'all';

    // useEffect(() => {
    //     let url = 'http://localhost:3001/games';
    //     if (categoryFilter !== 'all') {
    //         url += `?categoryId=${categoryFilter}`;
    //     }
    //
    //     fetch(url)
    //         .then((res) => res.json())
    //         .then((data) => setGames(data))
    //         .catch((error) => console.error('Error fetching games:', error));
    // }, [categoryFilter]);

    useEffect(() => {
        if (user) {
            axios
                .get(`http://localhost:8080/library`, {
                    headers: { "User-ID": user.id },
                })
                .then((res) => setOwnedGames(res.data));
        }
    }, [user]);

    return (
        <div className="container">
            <h1>Welcome to SteamLite</h1>
            {user ? (
                <p>
                    Hello, {user.username}! You are logged in as <strong>{user.role}</strong>.
                </p>
            ) : (
                <p>Please log in to access more features.</p>
            )}
            <h2>Games</h2>
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
            <button
                onClick={() => setSearchParams({ category: '3' })}
                className="btn btn-gray"
            >
                Strategy
            </button>

            <br/>
            <br/>

            <div className="grid">
                {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
}

export default Home;