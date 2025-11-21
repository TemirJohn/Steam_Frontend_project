import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../config/axiosConfig';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import { toast } from 'react-toastify';

function Home() {
    const user = useSelector((state) => state.auth.user);
    const [games, setGames] = useState([]);
    const [ownedGames, setOwnedGames] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState([]);
    const categoryFilter = searchParams.get('category') || 'all';

    useEffect(() => {
        axiosInstance.get(`/games?categoryId=${categoryFilter === 'all' ? '' : categoryFilter}`)
            .then((res) => setGames(res.data))
            .catch((err) => {
                console.error('Error fetching games:', err);
            });
        if (user) {
            axiosInstance.get('/library')
                .then((res) => setOwnedGames(res.data))
                .catch((err) => {
                    console.error('Error fetching library:', err);
                    toast.error('Failed to load library');
                });
        }
    }, [user, categoryFilter]);

    useEffect(() => {
        axiosInstance.get('/categories')
            .then((res) => setCategories(res.data))
            .catch((err) => {
                console.error('Error fetching categories:', err);
                toast.error('Failed to load categories');
            });
    }, []);

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed"
            style={{
                backgroundColor: '#171a21',
            }}
        >
            <main className="container mx-auto px-4 py-12">
                {/* Welcome Container */}
                <div className="max-w-3xl mx-auto mb-10 p-8 bg-gray-800 bg-opacity-90 text-white rounded-xl shadow-xl text-center">
                    <h1 className="text-4xl font-bold text-purple-400 mb-4">Welcome to SteamLite</h1>
                    <p className="text-gray-300">
                        Discover amazing games with our advanced parallel search
                    </p>
                </div>

                {/* Search Bar with Parallel Processing */}
                <SearchBar />

                {/* Category Filters */}
                <div className="mb-8 flex flex-wrap justify-center gap-3">
                    <button
                        onClick={() => setSearchParams({})}
                        className={`px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-purple-600 transition ${
                            categoryFilter === 'all' ? 'bg-purple-600 font-bold' : ''
                        }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSearchParams({ category: `${cat.id}` })}
                            className={`px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-purple-600 transition ${
                                categoryFilter === `${cat.id}` ? 'bg-purple-600 font-bold' : ''
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {games.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>

                {games.length === 0 && (
                    <div className="text-center text-gray-400 py-12">
                        <p className="text-xl">No games found in this category</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;