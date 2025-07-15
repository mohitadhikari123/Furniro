import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { addToCart, decreaseItemQuantity, getCart, removeFromCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.get("/get", verifyToken, getCart);
router.post("/decrease", verifyToken, decreaseItemQuantity);  
router.delete("/remove/:productId", verifyToken, removeFromCart);

export default router;
