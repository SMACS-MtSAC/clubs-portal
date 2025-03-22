import express from "express";
import {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub,
  getClubEvents,
} from "../controllers/club.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.get("/", getClubs);
router.get("/:id", getClubById);

// Admin only routes
router.post("/", protect, authorize("admin"), createClub);
router.put("/:id", protect, authorize("admin"), updateClub);
router.delete("/:id", protect, authorize("admin"), deleteClub);

// Get events for a specific club
router.get("/:id/events", getClubEvents);

export default router;
