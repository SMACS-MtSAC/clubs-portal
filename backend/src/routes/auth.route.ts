import express from "express";
import {
  registerHandler,
  authUser,
  logoutUser,
  getCurrentUser,
  updateUserProfile,
  changePassword,
  createAdmin,
} from "../controllers/auth.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.post("/login", authUser);
router.post("/logout", logoutUser);
router.post("/create-admin", createAdmin); // Admin creation with passkeys

// Protected routes
router.get("/me", protect, getCurrentUser);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);

// Registration route - accessible by both admin and club officers
router.post(
  "/register",
  protect,
  authorize("admin", "club_officer"),
  registerHandler
);

export default router;
