import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

// ✅ Middleware to verify if a user is logged in
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized, Please Login  " });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// ✅ Middleware to verify if the user is an Admin
export const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// export const protect = async (req, res, next) => {
//     let token = req.headers.authorization;

//     if (token && token.startsWith("Bearer")) {
//         try {
//             token = token.split(" ")[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await User.findById(decoded.id).select("-password");
//             next();
//         } catch (error) {
//             res.status(401).json({ message: "Not authorized, token failed" });
//         }
//     } else {
//         res.status(401).json({ message: "Not authorized, no token" });
//     }
// };
