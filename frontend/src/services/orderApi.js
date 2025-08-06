const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const orderApi = {
    // Create a new order
    createOrder: async (orderData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create order');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Get user orders
    getUserOrders: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch orders');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }
};

export default orderApi;