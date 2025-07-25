import { Order } from "../models/Order.model.js";

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

export const createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { billingDetails, shippingAddress, orderItems, paymentMethod, subtotal, totalAmount } = req.body;

        // Validate required fields
        if (!billingDetails || !shippingAddress || !orderItems || !paymentMethod || !subtotal || !totalAmount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate billing details
        const { firstName, lastName, phone, email } = billingDetails;
        if (!firstName || !lastName || !phone || !email) {
            return res.status(400).json({ message: "Billing details are incomplete" });
        }

        // Validate shipping address
        const { streetAddress, city, province, country, postalCode } = shippingAddress;
        if (!streetAddress || !city || !province || !postalCode) {
            return res.status(400).json({ message: "Shipping address is incomplete" });
        }
        // Validate order items
        if (!Array.isArray(orderItems) || orderItems.length === 0) {
            return res.status(400).json({ message: "Order items cannot be empty" });
        }


        const newOrder = new Order({ user: userId, ...req.body });
        await newOrder.save();
        res.status(201).json(newOrder);

        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.userId }).populate("orderItems.product");
        
        // Optimize image URLs in populated product data
        const optimizedOrders = orders.map(order => {
            const orderObj = order.toObject();
            if (orderObj.orderItems && orderObj.orderItems.length > 0) {
                orderObj.orderItems = orderObj.orderItems.map(item => {
                    if (item.product && item.product.images && item.product.images.length > 0) {
                        item.product.images = item.product.images.map(optimizeImageUrl);
                    }
                    return item;
                });
            }
            return orderObj;
        });
        
        res.json(optimizedOrders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

