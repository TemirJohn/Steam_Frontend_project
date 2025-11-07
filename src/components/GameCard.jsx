import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { buildAssetUrl } from '../utils/url';

function GameCard({ game }) {
    const user = useSelector((state) => state.auth.user);

    const isEditor = user &&
        (user.role === 'admin' || (user.role === 'developer' && user.id === game.developerId));

    return (
        <div className="bg-gray-800 bg-opacity-90 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img
                src={buildAssetUrl(game.image)}
                alt={game.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4 text-white">
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">{game.name}</h3>
                <p className="text-gray-300 mb-2">
                    {game.description.length > 100
                        ? game.description.substring(0, 100) + '...'
                        : game.description}
                </p>
                <p className="text-green-400 font-bold">${game.price.toFixed(2)}</p>
                <Link to={`/games/${game.id}`}>
                    <button className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-all duration-200">
                        View Details
                    </button>
                </Link>

                {isEditor && (
                    <div className="mt-3 flex gap-2">
                        <Link to={`/games/${game.id}/edit`}>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition">
                                Edit
                            </button>
                        </Link>
                        <Link to={`/delete-game/${game.id}`}>
                            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition">
                                Delete
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GameCard;