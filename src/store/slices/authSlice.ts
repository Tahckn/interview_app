import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {removeToken, isTokenValid} from 'services/auth';

interface AuthState {
    isAuthenticated: boolean;
    roles: string[];
}

const initialState: AuthState = {
    isAuthenticated: isTokenValid(),
    roles: [],
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ roles: string[] }>) => {
            state.isAuthenticated = true;
            state.roles = action.payload.roles;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.roles = [];
            removeToken();
        },
    },
});

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;