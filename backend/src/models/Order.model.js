import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    billingDetails: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        companyName: { type: String }, 
        phone: { type: String, required: true },
        email: { type: String, required: true },
    },

    shippingAddress: {
        streetAddress: { type: String, required: true },
        city: { type: String, required: true },
        province: { type: String, required: true },
        country: { type: String, required: true, default: "India" },
        postalCode: { type: String, required: true },
    },

    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
        }
    ],

    paymentMethod: {
        type: String,
        enum: ["UPI", "Cash On Delivery", "Stripe"],
        required: true
    },

    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    transactionId: { type: String }, // Only for bank transfers

    subtotal: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    additionalInfo: { type: String }, // For order notes

    orderStatus: {
        type: String,
        enum: ["Processing", "Confirmed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
        default: "Processing"
    },

    deliveryTracking: {
        orderPlaced: {
            status: { type: Boolean, default: true },
            timestamp: { type: Date, default: Date.now }
        },
        confirmed: {
            status: { type: Boolean, default: false },
            timestamp: { type: Date }
        },
        shipped: {
            status: { type: Boolean, default: false },
            timestamp: { type: Date }
        },
        outForDelivery: {
            status: { type: Boolean, default: false },
            timestamp: { type: Date }
        },
        delivered: {
            status: { type: Boolean, default: false },
            timestamp: { type: Date }
        }
    },

}, { timestamps: true });

export const Order = mongoose.model("Order", OrderSchema);
