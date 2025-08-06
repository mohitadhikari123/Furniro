import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productApi } from '../services/productApi';

// Cache duration in milliseconds (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000;

// Load products cache from localStorage
const loadProductsFromStorage = () => {
    try {
        const serializedProducts = localStorage.getItem('productsCache');
        if (serializedProducts === null) {
            return {
                cache: {},
                loading: false,
                error: null,
                lastFetched: {},
            };
        }
        const parsed = JSON.parse(serializedProducts);
        
        // Check if cache is still valid
        const now = Date.now();
        const validCache = {};
        const validLastFetched = {};
        
        Object.keys(parsed.lastFetched || {}).forEach(category => {
            const lastFetched = parsed.lastFetched[category];
            if (now - lastFetched < CACHE_DURATION) {
                validCache[category] = parsed.cache[category];
                validLastFetched[category] = lastFetched;
            }
        });
        
        return {
            cache: validCache,
            loading: false,
            error: null,
            lastFetched: validLastFetched,
        };
    } catch (err) {
        return {
            cache: {},
            loading: false,
            error: null,
            lastFetched: {},
        };
    }
};

// Save products cache to localStorage
const saveProductsToStorage = (state) => {
    try {
        const serializedProducts = JSON.stringify({
            cache: state.cache,
            lastFetched: state.lastFetched,
        });
        localStorage.setItem('productsCache', serializedProducts);
    } catch (err) {
        // Ignore write errors
    }
};

// Check if cache is still valid
const isCacheValid = (lastFetched) => {
    if (!lastFetched) return false;
    return Date.now() - lastFetched < CACHE_DURATION;
};

// Async thunk for fetching products with cache check
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ category = null, forceRefresh = false }, { getState, rejectWithValue }) => {
        try {
            const cacheKey = category || 'all';
            const state = getState().products;
            
            // Check if we have valid cached data and don't force refresh
            if (!forceRefresh && 
                state.cache[cacheKey] && 
                isCacheValid(state.lastFetched[cacheKey])) {
                return { products: state.cache[cacheKey], category: cacheKey, fromCache: true };
            }
            
            const products = await productApi.getAllProducts(category);
            return { products, category: cacheKey, fromCache: false };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for searching products (no caching for search results)
export const searchProducts = createAsyncThunk(
    'products/searchProducts',
    async ({ searchQuery, category = null }, { rejectWithValue }) => {
        try {
            const products = await productApi.getAllProducts(category, searchQuery);
            return { products, searchQuery, category };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        ...loadProductsFromStorage(),
        searchResults: [],
        searchQuery: '',
        searchLoading: false,
        searchError: null,
    },
    reducers: {
        clearProductsCache: (state) => {
            state.cache = {};
            state.lastFetched = {};
            saveProductsToStorage(state);
        },
        clearError: (state) => {
            state.error = null;
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.searchQuery = '';
            state.searchError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state, action) => {
                // Only show loading if not serving from cache
                const { category = null } = action.meta.arg;
                const cacheKey = category || 'all';
                if (!state.cache[cacheKey] || !isCacheValid(state.lastFetched[cacheKey])) {
                    state.loading = true;
                }
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                const { products, category, fromCache } = action.payload;
                
                // Only update cache and timestamp if not from cache
                if (!fromCache) {
                    state.cache[category] = products;
                    state.lastFetched[category] = Date.now();
                    saveProductsToStorage(state);
                }
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Search products reducers
            .addCase(searchProducts.pending, (state) => {
                state.searchLoading = true;
                state.searchError = null;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.searchLoading = false;
                const { products, searchQuery } = action.payload;
                state.searchResults = products;
                state.searchQuery = searchQuery;
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.searchLoading = false;
                state.searchError = action.payload;
            });
    },
});

export const { clearProductsCache, clearError, clearSearchResults } = productsSlice.actions;

// Selectors
export const selectProductsByCategory = (state, category = 'all') => {
    return state.products.cache[category] || [];
};

export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;

// Search selectors
export const selectSearchResults = (state) => state.products.searchResults;
export const selectSearchQuery = (state) => state.products.searchQuery;
export const selectSearchLoading = (state) => state.products.searchLoading;
export const selectSearchError = (state) => state.products.searchError;

export default productsSlice.reducer;