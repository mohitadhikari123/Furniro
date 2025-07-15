import mongoose from "mongoose";
import { Cart } from "../models/Cart.model.js";

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }

        // ✅ Validate productId
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid Product ID" });
        }

        const productObjectId = new mongoose.Types.ObjectId(productId);

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{ product: productObjectId, quantity }]
            });
        } else {
            const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (productIndex > -1) {
                cart.items[productIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productObjectId, quantity });
            }
        }

        await cart.save();
        res.status(200).json({ message: "Product added to cart", cart });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart) {
            return res.status(200).json({ message: "Cart is empty", cart: { items: [] } });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const decreaseItemQuantity = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (productIndex === -1) return res.status(404).json({ message: "Product not found in cart" });

        if (cart.items[productIndex].quantity > 1) {
            cart.items[productIndex].quantity -= 1;
        } else {
            cart.items.splice(productIndex, 1);
        }

        await cart.save();
        res.status(200).json({ message: "Item quantity updated", cart });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) return res.status(404).json({ message: "Cart not found" });
        
        const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        await cart.save();
        res.status(200).json({ message: "Product removed from cart", cart });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};