import { Payment } from "../models/Payment.model.js";
import { Order } from "../models/Order.model.js";

// Stripe configuration from environment variables
const STRIPE_CONFIG = {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY
};

// Validate Stripe configuration
if (!STRIPE_CONFIG.publishableKey || !STRIPE_CONFIG.secretKey) {
    console.warn('Warning: Stripe keys not found in environment variables. Using dummy values for development.');
    STRIPE_CONFIG.publishableKey = 'pk_test_dummy_key_for_demo';
    STRIPE_CONFIG.secretKey = 'sk_test_dummy_key_for_demo';
}

// Create payment intent (dummy implementation)
export const createPaymentIntent = async (req, res) => {
    try {
                console.log("Create Payment Intent");

        const { amount, currency = 'inr', orderId } = req.body;
        const userId = req.user.userId;

        // Validate order exists and belongs to user
        const order = await Order.findOne({ _id: orderId, user: userId });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Create dummy payment intent
        const paymentIntent = {
            id: `pi_dummy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency,
            status: 'requires_payment_method',
            client_secret: `pi_dummy_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
            created: Math.floor(Date.now() / 1000),
            metadata: {
                orderId: orderId,
                userId: userId
            },
            publishable_key: STRIPE_CONFIG.publishableKey
        };

        // Create payment record in database
        const payment = new Payment({
            user: userId,
            order: orderId,
            paymentMethod: "Card",
            transactionId: paymentIntent.id,
            paymentStatus: "Pending"
        });

        await payment.save();

        res.status(200).json({
            success: true,
            paymentIntent: paymentIntent,
            paymentId: payment._id
        });

    } catch (error) {
        console.error('Payment intent creation error:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to create payment intent", 
            error: error.message 
        });
    }
};

// Confirm payment (dummy implementation)
export const confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId, paymentMethodId, orderId } = req.body;
        const userId = req.user.userId;

        // Find the payment record
        const payment = await Payment.findOne({ 
            transactionId: paymentIntentId,
            user: userId 
        });

        if (!payment) {
            return res.status(404).json({ 
                success: false,
                message: "Payment not found" 
            });
        }

        // Simulate payment processing (dummy logic)
        const isPaymentSuccessful = Math.random() > 0.1; // 90% success rate for demo

        if (isPaymentSuccessful) {
            // Update payment status
            payment.paymentStatus = "Success";
            await payment.save();

            // Update order status
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentStatus = "Paid";
                order.transactionId = paymentIntentId;
                await order.save();
            }

            res.status(200).json({
                success: true,
                message: "Payment confirmed successfully",
                paymentStatus: "Success",
                transactionId: paymentIntentId
            });
        } else {
            // Payment failed
            payment.paymentStatus = "Failed";
            await payment.save();

            res.status(400).json({
                success: false,
                message: "Payment failed. Please try again.",
                paymentStatus: "Failed"
            });
        }

    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to confirm payment", 
            error: error.message 
        });
    }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const userId = req.user.userId;

        const payment = await Payment.findOne({ 
            _id: paymentId, 
            user: userId 
        }).populate('order');

        if (!payment) {
            return res.status(404).json({ 
                success: false,
                message: "Payment not found" 
            });
        }

        res.status(200).json({
            success: true,
            payment: {
                id: payment._id,
                transactionId: payment.transactionId,
                paymentMethod: payment.paymentMethod,
                paymentStatus: payment.paymentStatus,
                order: payment.order,
                createdAt: payment.createdAt
            }
        });

    } catch (error) {
        console.error('Get payment status error:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to get payment status", 
            error: error.message 
        });
    }
};

// Get dummy Stripe configuration
export const getStripeConfig = (req, res) => {
    res.status(200).json({
        success: true,
        publishableKey: STRIPE_CONFIG.publishableKey
    });
};