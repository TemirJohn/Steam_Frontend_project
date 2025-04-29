import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteGame } from '../redux/gameReducer';
import { logout } from '../redux/authReducer';
import axios from 'axios';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

Modal.setAppElement('#root');

function DeleteCard() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(true);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'developer')) {
            toast.error('Access denied! Only developers can delete games.');
            dispatch(logout());
            navigate('/login');
            return;
        }

        axios.get(`http://localhost:8080/games/${id}`)
            .then((res) => {
                const data = res.data;
                if (user.role === 'developer' && data.developerId !== user.id) {
                    toast.error('You can only delete your own games.');
                    navigate('/dashboard');
                } else {
                    setGame(data);
                }
            })
            .catch((error) => {
                console.error('Error fetching game:', error);
                toast.error('Failed to load game');
            });
    }, [id, user, dispatch, navigate]);

    async function handleDelete() {
        try {
            await axios.delete(`http://localhost:8080/games/${id}`);
            dispatch(deleteGame(Number(id)));
            toast.success('Game deleted successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error deleting game:', error);
            toast.error('Failed to delete game');
        }
    }

    if (!game) return <div>Loading...</div>;

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => navigate('/dashboard')}
            className="bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-20"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <h2 className="text-xl font-semibold mb-4">Delete Game</h2>
            <p>Are you sure you want to delete "{game.name}"?</p>
            <p className="text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Confirm Delete
                </button>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    );
}

export default DeleteCard;