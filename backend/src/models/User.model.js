import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"], },
    email: { type: String, required: [true, "Email is required"], },
    password: { type: String, required: [true, "Password is required"] },
    address: { type: String },
    phone: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);
