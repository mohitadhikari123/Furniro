import mongoose from "mongoose";
import { Product } from "../models/Product.model.js";

// Helper function to optimize image URLs
const optimizeImageUrl = (url) => {
    if (!url) return url;
    
    // Optimize Unsplash images
    if (url.includes('unsplash.com')) {
        // Add optimization parameters: width=800, quality=80, format=webp
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}w=800&q=80&fm=webp&fit=crop`;
    }
    
    // Optimize Pexels images
    if (url.includes('pexels.com')) {
        // Add optimization parameters: width=800, height=600, fit=crop
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}auto=compress&cs=tinysrgb&w=800&h=600&fit=crop`;
    }
    
    return url;
};

export const getAllProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let filter = {};
        
        if (category) {
            filter.category = category;
        }
        
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }
        
        const products = await Product.find(filter);
        
        // Optimize image URLs in the response
        const optimizedProducts = products.map(product => {
            const productObj = product.toObject();
            if (productObj.images && productObj.images.length > 0) {
                productObj.images = productObj.images.map(optimizeImageUrl);
            }
            return productObj;
        });
        
        res.json(optimizedProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Product ID is required." });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID format." });
    }
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        
        // Optimize image URLs in the response
        const productObj = product.toObject();
        if (productObj.images && productObj.images.length > 0) {
            productObj.images = productObj.images.map(optimizeImageUrl);
        }
        
        res.json(productObj);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Product ID is required." });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID format." });
    }
    try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found." });
    }
    res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Product ID is required." });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID format." });
    }
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
