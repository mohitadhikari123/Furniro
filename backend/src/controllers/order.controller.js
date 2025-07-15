import { Order } from "../models/Order.model.js";

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
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

