import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {removeToken, isTokenValid} from 'services/auth';

// Define the shape of the authentication state
interface AuthState {
    isAuthenticated: boolean;
    roles: string[];
}

// Set the initial state
// isAuthenticated is determined by checking if a valid token exists
const initialState: AuthState = {
    isAuthenticated: isTokenValid(),
    roles: [],
};

// Create the auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Login action
        // Updates the state to reflect that the user is authenticated
        // and sets the user's roles
        login: (state, action: PayloadAction<{ roles: string[] }>) => {
            state.isAuthenticated = true;
            state.roles = action.payload.roles;
        },
        // Logout action
        // Resets the auth state and removes the authentication token
        logout: (state) => {
            state.isAuthenticated = false;
            state.roles = [];
            removeToken();
        },
    },
});

// Export the action creators
export const {login, logout} = authSlice.actions;

// Export the reducer
export default authSlice.reducer;