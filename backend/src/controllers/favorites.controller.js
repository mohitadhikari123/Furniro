import { Favorites } from "../models/Favorites.model.js";
import { Product } from "../models/Product.model.js";
import mongoose from "mongoose";

// Helper function to optimize image URLs
const optimizeImageUrl = (url) => {
    if (!url) return url;
    
    // Optimize Unsplash images
    if (url.includes('unsplash.com')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}w=800&q=80&fm=webp&fit=crop`;
    }
    
    // Optimize Pexels images
    if (url.includes('pexels.com')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}auto=compress&cs=tinysrgb&w=800&h=600&fit=crop`;
    }
    
    return url;
};

// Get user's favorites
export const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorites.findOne({ user: req.user.userId }).populate('products');
        
        if (!favorites) {
            return res.json({ products: [] });
        }
        
        // Optimize image URLs in the response
        const optimizedProducts = favorites.products.map(product => {
            const productObj = product.toObject();
            if (productObj.images && productObj.images.length > 0) {
                productObj.images = productObj.images.map(optimizeImageUrl);
            }
            return productObj;
        });
        
        res.json({ products: optimizedProducts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add product to favorites
export const addToFavorites = async (req, res) => {
    try {
        const { productId } = req.body;
        
        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }
        
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID format" });
        }
        
        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        // Find or create user's favorites
        let favorites = await Favorites.findOne({ user: req.user.userId });
        
        if (!favorites) {
            favorites = new Favorites({ user: req.user.userId, products: [] });
        }
        
        // Check if product is already in favorites
        if (favorites.products.includes(productId)) {
            return res.status(400).json({ error: "Product already in favorites" });
        }
        
        // Add product to favorites
        favorites.products.push(productId);
        await favorites.save();
        
        res.status(201).json({ message: "Product added to favorites successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove product from favorites
export const removeFromFavorites = async (req, res) => {
    try {
        const { productId } = req.params;
        
        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }
        
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID format" });
        }
        
        // Find user's favorites
        const favorites = await Favorites.findOne({ user: req.user.userId });
        
        if (!favorites) {
            return res.status(404).json({ error: "No favorites found" });
        }
        
        // Check if product is in favorites
        if (!favorites.products.includes(productId)) {
            return res.status(400).json({ error: "Product not in favorites" });
        }
        
        // Remove product from favorites
        favorites.products = favorites.products.filter(id => !id.equals(productId));
        await favorites.save();
        
        res.json({ message: "Product removed from favorites successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Clear all favorites
export const clearFavorites = async (req, res) => {
    try {
        const favorites = await Favorites.findOne({ user: req.user.userId });
        
        if (!favorites) {
            return res.status(404).json({ error: "No favorites found" });
        }
        
        favorites.products = [];
        await favorites.save();
        
        res.json({ message: "All favorites cleared successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Check if product is in favorites
export const checkFavorite = async (req, res) => {
    try {
        const { productId } = req.params;
        
        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }
        
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID format" });
        }
        
        const favorites = await Favorites.findOne({ user: req.user.userId });
        
        if (!favorites) {
            return res.json({ isFavorite: false });
        }
        
        const isFavorite = favorites.products.includes(productId);
        res.json({ isFavorite });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};