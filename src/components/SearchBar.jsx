import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchGamesAdvanced } from '../config/concurrentApi';
import { buildAssetUrl } from '../utils/url';
import { toast } from 'react-toastify';

function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [searchTime, setSearchTime] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!query.trim()) {
            toast.error('Please enter a search query');
            return;
        }

        setIsSearching(true);
        setShowResults(true);

        const result = await searchGamesAdvanced(query);
        
        if (result.success) {
            setResults(result.data);
            setSearchTime(result.searchTime);
            
            if (result.data.length === 0) {
                toast.info('No games found');
            } else {
                toast.success(`Found ${result.totalFound} games in ${result.searchTime}`, {
                    autoClose: 2000
                });
            }
        } else {
            toast.error(result.error);
            setResults([]);
        }

        setIsSearching(false);
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setShowResults(false);
        setSearchTime(null);
    };

    return (
        <div className="mb-8">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search games (parallel search across name, description, category)..."
                    className="flex-1 bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isSearching}
                />
                <button
                    type="submit"
                    disabled={isSearching}
                    className={`bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition ${
                        isSearching ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isSearching ? (
                        <span className="flex items-center">
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Searching...
                        </span>
                    ) : (
                        '🔍 Search'
                    )}
                </button>
                {showResults && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition"
                    >
                        Clear
                    </button>
                )}
            </form>

            {/* Search Results */}
            {showResults && (
                <div className="mt-6 max-w-6xl mx-auto">
                    {/* Performance Info */}
                    {searchTime && (
                        <div className="mb-4 text-center">
                            <span className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm">
                                ⚡ Found {results.length} results in {searchTime} using parallel search
                            </span>
                        </div>
                    )}

                    {/* Results Grid */}
                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {results.map((game) => (
                                <Link key={game.id} to={`/games/${game.id}`}>
                                    <div className="bg-gray-800 bg-opacity-90 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                        <img
                                            src={buildAssetUrl(game.image)}
                                            alt={game.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4 text-white">
                                            <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                                                {game.name}
                                            </h3>
                                            <p className="text-gray-300 mb-2 text-sm">
                                                {game.description?.length > 80
                                                    ? game.description.substring(0, 80) + '...'
                                                    : game.description}
                                            </p>
                                            <p className="text-green-400 font-bold">
                                                ${game.price?.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            <p className="text-xl">No games found for "{query}"</p>
                            <p className="text-sm mt-2">Try a different search term</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;