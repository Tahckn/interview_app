import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

// Configure the Redux store
export const store = configureStore({
    reducer: {
        // Add the authReducer under the key 'auth'
        // This means all state related to authentication will be stored under state.auth
        auth: authReducer,
        // Add the userReducer under the key 'user'
        // This means all state related to user will be stored under state.user
        user: userReducer,
    },
});

// Infer the `RootState` type from the store itself
// This type represents the entire state tree of your application
export type RootState = ReturnType<typeof store.getState>;

// Infer the `AppDispatch` type from the store itself
// This type represents the dispatch function
export type AppDispatch = typeof store.dispatch;