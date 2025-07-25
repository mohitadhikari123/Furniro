import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import favoritesReducer from './slices/favoritesSlice';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        favorites: favoritesReducer,
        auth: authReducer,
        notification: notificationReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
