import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from 'src/types/UserInfo';

// Define a type for the slice state
interface UserState {
    info: UserInfo | null;
    loading: boolean;
    error: string | null;
}

// Define the initial state using that type
const initialState: UserState = {
    info: null,
    loading: false,
    error: null,
};

// Create the user slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Reducers for setting the user info, loading state, and error state
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.info = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearUserInfo: (state) => {
            state.info = null;
            state.loading = false;
            state.error = null;
        },
    },
});

export const { setUserInfo, setLoading, setError, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;