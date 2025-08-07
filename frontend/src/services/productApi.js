const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const productApi = {
    // Get all products
    getAllProducts: async (category = null, search = null, signal = null) => {
        try {
            let url = `${API_BASE_URL}/products`;
            const params = new URLSearchParams();
            
            if (category) {
                params.append('category', category);
            }
            if (search) {
                params.append('search', search);
            }
            
            if (params.toString()) {
                url += `?${params.toString()}`; // Add query parameters if they exist
            }
            
            const response = await fetch(url, { signal });
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    // Get single product by ID
    getProductById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }
};
