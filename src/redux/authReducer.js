const initialState = { user: null, token: null };

export const setUser = (user) => ({
    type: 'SET_USER',
    payload: user,
});

export const login = (user, token) => ({
    type: 'LOGIN',
    payload: { user, token },
});

export const logout = () => ({
    type: 'LOGOUT',
});

function authReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'LOGIN':
            return { user: action.payload.user, token: action.payload.token };
        case 'LOGOUT':
            return { user: null, token: null };
        default:
            return state;
    }
}

export default authReducer;