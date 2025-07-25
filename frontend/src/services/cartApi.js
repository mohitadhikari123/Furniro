const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class CartAPI {
    async addToCart(productId, quantity = 1) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId, quantity })
            });
            
            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }

    async getCart() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/cart/get`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    }

    async removeFromCart(productId) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/cart/remove/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to remove item from cart');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    }

    async decreaseQuantity(productId) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/cart/decrease`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId })
            });
            
            if (!response.ok) {
                throw new Error('Failed to decrease item quantity');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error decreasing quantity:', error);
            throw error;
        }
    }
}

export const cartApi = new CartAPI();