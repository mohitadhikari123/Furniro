import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as favoritesApi from '../services/favoritesApi';

// Load favorites from localStorage (fallback)
const loadFavoritesFromStorage = () => {
    try {
        const serializedFavorites = localStorage.getItem('favorites');
        if (serializedFavorites === null) {
            return [];
        }
        return JSON.parse(serializedFavorites);
    } catch (err) {
        return [];
    }
};

// Save favorites to localStorage (backup)
const saveFavoritesToStorage = (favoriteItems) => {
    try {
        const serializedFavorites = JSON.stringify(favoriteItems);
        localStorage.setItem('favorites', serializedFavorites);
    } catch (err) {
        // Ignore write errors
    }
};

// Async thunks for API calls
export const fetchFavorites = createAsyncThunk(
    'favorites/fetchFavorites',
    async (_, { rejectWithValue }) => {
        try {
            const favorites = await favoritesApi.getFavorites();
            return favorites;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addToFavoritesAsync = createAsyncThunk(
    'favorites/addToFavoritesAsync',
    async (product, { rejectWithValue }) => {
        try {
            await favoritesApi.addToFavorites(product._id);
            return product;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeFromFavoritesAsync = createAsyncThunk(
    'favorites/removeFromFavoritesAsync',
    async (productId, { rejectWithValue }) => {
        try {
            await favoritesApi.removeFromFavorites(productId);
            return productId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const clearFavoritesAsync = createAsyncThunk(
    'favorites/clearFavoritesAsync',
    async (_, { rejectWithValue }) => {
        try {
            await favoritesApi.clearFavorites();
            return [];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Sync localStorage favorites with backend on login
export const syncFavoritesWithBackend = createAsyncThunk(
    'favorites/syncFavoritesWithBackend',
    async (_, { getState, dispatch, rejectWithValue }) => {
        try {
            // Get current localStorage favorites
            const localFavorites = getState().favorites.favoriteItems;
            
            // Add localStorage favorites to backend if any exist
            if (localFavorites.length > 0) {
                for (const product of localFavorites) {
                    try {
                        await favoritesApi.addToFavorites(product);
                    } catch (error) {
                        console.warn('Failed to sync favorite:', product._id, error);
                    }
                }
            }
            
            // Fetch all favorites from backend
            const backendFavorites = await favoritesApi.getFavorites();
            return backendFavorites;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    favoriteItems: loadFavoritesFromStorage(),
    loading: false,
    error: null,
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        // Synchronous actions for offline/fallback functionality
        addToFavorites: (state, action) => {
            const existingItem = state.favoriteItems.find(
                (item) => item._id === action.payload._id
            );
            if (!existingItem) {
                state.favoriteItems.push(action.payload);
                saveFavoritesToStorage(state.favoriteItems);
            }
        },
        removeFromFavorites: (state, action) => {
            state.favoriteItems = state.favoriteItems.filter(
                (item) => item._id !== action.payload
            );
            saveFavoritesToStorage(state.favoriteItems);
        },
        clearFavorites: (state) => {
            state.favoriteItems = [];
            saveFavoritesToStorage(state.favoriteItems);
        },
        clearLocalStorage: (state) => {
            state.favoriteItems = [];
            localStorage.removeItem('favorites');
        },
        setFavorites: (state, action) => {
            state.favoriteItems = action.payload;
            saveFavoritesToStorage(state.favoriteItems);
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch favorites
            .addCase(fetchFavorites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.loading = false;
                state.favoriteItems = action.payload;
                saveFavoritesToStorage(state.favoriteItems);
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add to favorites
            .addCase(addToFavoritesAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToFavoritesAsync.fulfilled, (state, action) => {
                state.loading = false;
                const existingItem = state.favoriteItems.find(
                    (item) => item._id === action.payload._id
                );
                if (!existingItem) {
                    state.favoriteItems.push(action.payload);
                    saveFavoritesToStorage(state.favoriteItems);
                }
            })
            .addCase(addToFavoritesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove from favorites
            .addCase(removeFromFavoritesAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromFavoritesAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.favoriteItems = state.favoriteItems.filter(
                    (item) => item._id !== action.payload
                );
                saveFavoritesToStorage(state.favoriteItems);
            })
            .addCase(removeFromFavoritesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Clear favorites
            .addCase(clearFavoritesAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearFavoritesAsync.fulfilled, (state) => {
                state.loading = false;
                state.favoriteItems = [];
                saveFavoritesToStorage(state.favoriteItems);
            })
            .addCase(clearFavoritesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Sync favorites cases
            .addCase(syncFavoritesWithBackend.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(syncFavoritesWithBackend.fulfilled, (state, action) => {
                state.loading = false;
                state.favoriteItems = action.payload;
                saveFavoritesToStorage(state.favoriteItems);
            })
            .addCase(syncFavoritesWithBackend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { addToFavorites, removeFromFavorites, clearFavorites, setFavorites, clearLocalStorage } = favoritesSlice.actions;
export default favoritesSlice.reducer;