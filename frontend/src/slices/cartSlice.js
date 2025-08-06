import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../services/cartApi';

// Load cart from localStorage
const loadCartFromStorage = () => {
    try {
        const serializedCart = localStorage.getItem('cart');
        if (serializedCart === null) {
            return { cartItems: [], loading: false, error: null, lastSynced: null };
        }
        return JSON.parse(serializedCart);
    } catch (err) {
        return { cartItems: [], loading: false, error: null, lastSynced: null };
    }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
    try {
        const serializedCart = JSON.stringify(cart);
        localStorage.setItem('cart', serializedCart);
    } catch (err) {
        console.error('Could not save cart to localStorage:', err);
    }
};

const initialState = loadCartFromStorage();

// Async thunks for API calls
export const addToCartAsync = createAsyncThunk(
    'cart/addToCartAsync',
    async ({ product, quantity = 1 }, { getState, dispatch, rejectWithValue }) => {
        try {
            // Check if item already exists to prevent duplicates
            const currentState = getState().cart;
            const existingItem = currentState.cartItems.find(item => item._id === product._id);
            
            // Update state immediately
            if (existingItem) {
                dispatch({ type: 'cart/updateQuantity', payload: { productId: product._id, quantity: existingItem.quantity + quantity } });
            } else {
                dispatch({ type: 'cart/addToCart', payload: { product, quantity } });
            }
            
            // Then sync with backend (non-blocking)
            if (localStorage.getItem('token')) {
                cartApi.addToCart(product._id, quantity).catch(error => {
                    console.error('Failed to sync with backend:', error);
                });
            }
            
            return { product, quantity };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeFromCartAsync = createAsyncThunk(
    'cart/removeFromCartAsync',
    async (productId, { getState, rejectWithValue }) => {
        try {
            // Remove from local storage immediately
            const currentState = getState().cart;
            const updatedItems = currentState.cartItems.filter(item => item._id !== productId);
            const updatedCart = { ...currentState, cartItems: updatedItems };
            saveCartToStorage(updatedCart);
            
            // Sync with backend
            if (localStorage.getItem('token')) {
                cartApi.removeFromCart(productId).catch(error => {
                    console.error('Failed to sync with backend:', error);
                });
            }
            
            return productId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const syncCartWithBackend = createAsyncThunk(
    'cart/syncCartWithBackend',
    async (_, { getState, rejectWithValue }) => {
        try {
            if (!localStorage.getItem('token')) {
                return null;
            }
            
            // Get current localStorage cart items
            const localCartItems = getState().cart.cartItems;
            
            // Add localStorage cart items to backend if any exist
            if (localCartItems.length > 0) {
                for (const item of localCartItems) {
                    try {
                        console.log("cartAPI  Called start ");
                        await cartApi.addToCart(item._id, item.quantity);
                        console.log("cartAPI Called end");
                    } catch (error) {
                        console.warn('Failed to sync cart item:', item._id, error);
                    }
                }
            }
            
            // Fetch all cart items from backend
            const backendCart = await cartApi.getCart();
            return { backendCart, shouldReplace: true };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { product, quantity = 1 } = action.payload;
            const existingItem = state.cartItems.find(item => item._id === product._id);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.cartItems.push({ ...product, quantity });
            }
            
            saveCartToStorage(state);
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item._id !== action.payload);
            saveCartToStorage(state);
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.cartItems.find(item => item._id === productId);
            if (item) {
                item.quantity = quantity;
                if (item.quantity <= 0) {
                    state.cartItems = state.cartItems.filter(item => item._id !== productId);
                }
            }
            saveCartToStorage(state);
        },
        clearCart: (state) => {
            state.cartItems = [];
            saveCartToStorage(state);
        },
        setLastSynced: (state) => {
            state.lastSynced = new Date().toISOString();
            saveCartToStorage(state);
        },
        clearLocalStorage: (state) => {
            state.cartItems = [];
            state.lastSynced = null;
            localStorage.removeItem('cart');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCartAsync.pending, (state) => {
                // Don't set loading to true for add operations since we update state immediately
                state.error = null;
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.lastSynced = new Date().toISOString();
                saveCartToStorage(state);
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                state.cartItems = state.cartItems.filter(item => item._id !== action.payload);
                state.lastSynced = new Date().toISOString();
                saveCartToStorage(state);
            })
            .addCase(syncCartWithBackend.fulfilled, (state, action) => {
                if (action.payload && action.payload.shouldReplace && action.payload.backendCart && action.payload.backendCart.items) {
                    // Only replace cart items when explicitly syncing (like on login)
                    state.cartItems = action.payload.backendCart.items.map(item => ({
                        ...item.product,
                        quantity: item.quantity
                    }));
                    state.lastSynced = new Date().toISOString();
                    saveCartToStorage(state);
                }
            });
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setLastSynced, clearLocalStorage } = cartSlice.actions;
export default cartSlice.reducer;
