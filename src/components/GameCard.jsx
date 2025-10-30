import { Link } from 'react-router-dom';

function GameCard({ game }) {
    return (
        <div className="game-card p-4 bg-gray-100 rounded shadow">
            <img src={`http://localhost:8080/${game.image}`} alt={game.name} className="w-full h-48 object-cover mb-2" />
            <h3 className="text-lg font-semibold">{game.name}</h3>
            <p>${game.price.toFixed(2)}</p>
            <p className="text-gray-600">{game.description}</p>
            <Link to={`/games/${game.id}`} className="text-blue-500 hover:underline">View Details</Link>
        </div>
    );
}

export default GameCard;