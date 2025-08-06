import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { createOrder, getUserOrders, updateOrderStatus, getOrderById } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getUserOrders);
router.get("/:orderId", verifyToken, getOrderById);
router.put("/:orderId/status", verifyToken, updateOrderStatus);

export default router;
