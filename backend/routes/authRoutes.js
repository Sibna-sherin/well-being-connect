
import express from "express";
import { register, login, getMe, requestPasswordReset, resetPassword } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/me", authenticate, getMe);

export default router;
