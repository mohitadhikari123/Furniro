import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    paymentMethod: { type: String, enum: ["Card", "PayPal"], required: true },
    transactionId: { type: String, required: true },
    paymentStatus: { type: String, enum: ["Success", "Failed", "Pending"], default: "Pending" }
}, { timestamps: true });

export const Payment = mongoose.model("Payment", PaymentSchema);
