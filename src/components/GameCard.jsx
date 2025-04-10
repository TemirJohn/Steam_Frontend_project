import { Link } from 'react-router-dom';

function GameCard({ game }) {
    return (
        <div className="game-card">
            <h3>{game.title}</h3>
            <p>${game.price}</p>
            <p>{game.description}</p>
            <Link to={`/games/${game.id}`}>View Details</Link>
        </div>
    );
}

export default GameCard;