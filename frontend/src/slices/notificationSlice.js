import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    message: null,
    type: null, // 'success', 'error', 'info'
    isVisible: false,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification: (state, action) => {
            state.message = action.payload.message;
            state.type = action.payload.type || 'info';
            state.isVisible = true;
        },
        hideNotification: (state) => {
            state.message = null;
            state.type = null;
            state.isVisible = false;
        },
    },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;