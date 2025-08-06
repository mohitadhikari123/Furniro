import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { 
    createPaymentIntent, 
    confirmPayment, 
    getPaymentStatus 
} from "../controllers/payment.controller.js";

const router = express.Router();

// Create payment intent for Stripe
router.post("/create-payment-intent", verifyToken, createPaymentIntent);

// Confirm payment after successful Stripe payment
router.post("/confirm-payment", verifyToken, confirmPayment);

// Get payment status
router.get("/status/:paymentId", verifyToken, getPaymentStatus);

export default router;