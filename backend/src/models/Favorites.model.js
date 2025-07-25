import mongoose from "mongoose";

const FavoritesSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
}, { timestamps: true });

// Ensure one favorites document per user
FavoritesSchema.index({ user: 1 }, { unique: true });

export const Favorites = mongoose.model("Favorites", FavoritesSchema);