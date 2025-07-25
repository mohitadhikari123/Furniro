import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { 
    getFavorites, 
    addToFavorites, 
    removeFromFavorites, 
    clearFavorites, 
    checkFavorite 
} from "../controllers/favorites.controller.js";

const router = express.Router();

// All routes require authentication
router.get("/", verifyToken, getFavorites);
router.post("/add", verifyToken, addToFavorites);
router.delete("/remove/:productId", verifyToken, removeFromFavorites);
router.delete("/clear", verifyToken, clearFavorites);
router.get("/check/:productId", verifyToken, checkFavorite);

export default router;