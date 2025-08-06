const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const paymentApi = {
    // Create payment intent
    createPaymentIntent: async (amount, currency, orderId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/payments/create-payment-intent`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    amount,
                    currency,
                    orderId
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create payment intent');
            }

            return data;
        } catch (error) {
            console.error('Create payment intent error:', error);
            throw error;
        }
    },

    // Confirm payment
    confirmPayment: async (paymentIntentId, paymentMethodId, orderId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/payments/confirm-payment`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    paymentIntentId,
                    paymentMethodId,
                    orderId
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to confirm payment');
            }

            return data;
        } catch (error) {
            console.error('Confirm payment error:', error);
            throw error;
        }
    },

    // Get payment status
    getPaymentStatus: async (paymentId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/payments/status/${paymentId}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to get payment status');
            }

            return data;
        } catch (error) {
            console.error('Get payment status error:', error);
            throw error;
        }
    },

    // Get Stripe configuration from environment variables
    getStripeConfig: () => {
        const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
        
        if (!publishableKey) {
            console.warn('Warning: REACT_APP_STRIPE_PUBLISHABLE_KEY not found in environment variables');
            return {
                success: false,
                publishableKey: 'pk_test_dummy_key_for_demo' // Fallback for development
            };
        }
        
        return {
            success: true,
            publishableKey: publishableKey
        };
    }
};