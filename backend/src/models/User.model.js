import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"], },
    email: { type: String, required: [true, "Email is required"], },
    password: { type: String, required: function() { return !this.googleId; } }, // Password not required for Google users
    googleId: { type: String }, // For Google OAuth
    avatar: { type: String }, // For storing profile picture URL
    address: { type: String },
    phone: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);
