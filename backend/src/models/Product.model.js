import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, enum: ["Dining", "Living", "Bedroom"], default: "Living" },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }], 
    brand: { type: String },
    tags: { type: [String], default: [] },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    sizes: [{ type: String }],  
}, { timestamps: true });

export const Product = mongoose.model("Product", ProductSchema);
