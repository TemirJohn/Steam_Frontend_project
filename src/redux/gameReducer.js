import { createSlice } from '@reduxjs/toolkit';

const gameSlice = createSlice({
    name: 'games',
    initialState: {
        games: [],
    },
    reducers: {
        setGames: (state, action) => {
            state.games = action.payload;
        },
        addGame: (state, action) => {
            state.games.push(action.payload);
        },
        updateGame: (state, action) => {
            const updatedGame = action.payload;
            const index = state.games.findIndex((game) => game.id === updatedGame.id);
            if (index !== -1) {
                state.games[index] = updatedGame;
            }
        },
        deleteGame: (state, action) => {
            const id = action.payload;
            state.games = state.games.filter((game) => game.id !== id);
        },
    },
});

export const { setGames, addGame, updateGame, deleteGame } = gameSlice.actions;

export default gameSlice.reducer;