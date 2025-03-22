import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Protected routes - only authenticated users can access
router.post("/", protect, createEvent);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

export default router;
