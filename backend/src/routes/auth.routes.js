import express from "express";
import passport from "../config/passport.js";
import { register, login, getProfile, googleAuthSuccess, googleAuthFailure } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Traditional auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);

// Google OAuth routes
router.get("/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth/google/failure" }),
    googleAuthSuccess
);

router.get("/google/failure", googleAuthFailure);
 
export default router;
