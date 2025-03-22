import { Request, Response } from "express";
import { z } from "zod";
import EventModel from "../models/event.model";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

const createEventSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  posterImage: z.string().url().optional(),
  date: z.string().transform((str) => new Date(str)),
  location: z.string().min(1),
  clubId: z.union([z.string(), z.instanceof(mongoose.Types.ObjectId)]),
  collaboratingClubs: z.array(z.string()).optional(),
  advisors: z.array(z.string()),
});

const updateEventSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  posterImage: z.string().url().optional(),
  date: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  location: z.string().min(1).optional(),
  clubId: z
    .union([z.string(), z.instanceof(mongoose.Types.ObjectId)])
    .optional(),
  collaboratingClubs: z.array(z.string()).optional(),
  advisors: z.array(z.string()).optional(),
});

export const createEvent = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    // Check if user has a clubId (required for club officers)
    if (user.role === "club_officer" && !user.clubId) {
      res.status(400);
      throw new Error("Club officers must be associated with a club");
    }

    const eventData = createEventSchema.parse({
      ...req.body,
      clubId: user.clubId?.toString() || req.body.clubId, // Use user's clubId if available, otherwise use provided clubId
    });

    const event = new EventModel({
      ...eventData,
      clubId: new mongoose.Types.ObjectId(eventData.clubId),
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  }
);

export const getEvents = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const events = await EventModel.find().populate("clubId", "name");
    res.json(events);
  }
);

export const getEventById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const event = await EventModel.findById(req.params.id).populate(
      "clubId",
      "name"
    );
    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }
    res.json(event);
  }
);

export const updateEvent = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const updates = updateEventSchema.parse(req.body);
    const event = await EventModel.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    // Check if user is admin or from the club that owns the event
    const user = req.user;
    if (
      user.role !== "admin" &&
      (!user.clubId || user.clubId.toString() !== event.clubId.toString())
    ) {
      res.status(403);
      throw new Error("You can only update events for your own club");
    }

    // Only allow admins to change the club ownership
    if (updates.clubId && user.role !== "admin") {
      res.status(403);
      throw new Error("Only admins can change event ownership");
    }

    // Update all fields at once
    Object.assign(event, updates);
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  }
);

export const deleteEvent = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const event = await EventModel.findById(req.params.id);
    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    // Check if user is admin or from the club that owns the event
    const user = req.user;
    if (
      user.role !== "admin" &&
      (!user.clubId || user.clubId.toString() !== event.clubId.toString())
    ) {
      res.status(403);
      throw new Error("You can only delete events for your own club");
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  }
);
