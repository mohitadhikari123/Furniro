import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';
import { syncFavoritesWithBackend, clearLocalStorage as clearFavoritesLocalStorage } from './favoritesSlice';
import { syncCartWithBackend, clearLocalStorage as clearCartLocalStorage } from './cartSlice';
import { showNotification } from './notificationSlice';



// Async thunks for authentication actions
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { dispatch, rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);
            // Store token and user data in localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Sync localStorage data with backend and clear local storage
            await dispatch(syncFavoritesWithBackend());

            await dispatch(syncCartWithBackend());

           

            // Show success notification
            dispatch(showNotification({
                message: 'Login successful! Welcome back.',
                type: 'success'
            }));

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { dispatch, rejectWithValue }) => {
        try {
            const response = await authApi.register(userData);
            // Store token and user data in localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Sync localStorage data with backend and clear local storage
            await dispatch(syncFavoritesWithBackend());
            await dispatch(syncCartWithBackend());

            

            // Show success notification
            dispatch(showNotification({
                message: 'Registration successful! Welcome to Furniro.',
                type: 'success'
            }));

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getUserProfile = createAsyncThunk(
    'auth/getUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.getProfile();
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { dispatch }) => {
        // Clear localStorage for cart and favorites
        dispatch(clearFavoritesLocalStorage());
        dispatch(clearCartLocalStorage());

        // Clear auth data
        authApi.logout();

        // Show success notification
        dispatch(showNotification({
            message: 'Logout successful! See you soon.',
            type: 'success'
        }));
        return null;
    }
);

// Initial state
const initialState = {
    user: authApi.getStoredUser(),
    token: authApi.getToken(),
    isAuthenticated: authApi.isAuthenticated(),
    loading: false,
    error: null,
};

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            authApi.logout();
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Register cases
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Get profile cases
            .addCase(getUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout cases
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
            });
    },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;