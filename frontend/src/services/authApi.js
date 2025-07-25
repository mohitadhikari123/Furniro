const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const authApi = {
    // Register a new user
    register: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Get user profile
    getProfile: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to get profile');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // Get stored user data
    getStoredUser: () => {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    },

    // Get stored token
    getToken: () => {
        return localStorage.getItem('token');
    }
};

export default authApi;