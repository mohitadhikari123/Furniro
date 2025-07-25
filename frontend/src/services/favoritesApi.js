const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get user's favorites
export const getFavorites = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/api/favorites`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch favorites');
        }

        const data = await response.json();
        return data.products || [];
    } catch (error) {
        console.error('Error fetching favorites:', error);
        throw error;
    }
};

// Add product to favorites
export const addToFavorites = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/api/favorites/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add to favorites');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding to favorites:', error);
        throw error;
    }
};

// Remove product from favorites
export const removeFromFavorites = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/api/favorites/remove/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to remove from favorites');
        }

        return await response.json();
    } catch (error) {
        console.error('Error removing from favorites:', error);
        throw error;
    }
};

// Clear all favorites
export const clearFavorites = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/api/favorites/clear`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to clear favorites');
        }

        return await response.json();
    } catch (error) {
        console.error('Error clearing favorites:', error);
        throw error;
    }
};

// Check if product is in favorites
export const checkFavorite = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }

        const response = await fetch(`${API_BASE_URL}/api/favorites/check/${productId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.isFavorite || false;
    } catch (error) {
        console.error('Error checking favorite status:', error);
        return false;
    }
};