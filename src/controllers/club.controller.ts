import { Request, Response } from "express";
import { z } from "zod";
import ClubModel from "../models/club.model";
import expressAsyncHandler from "express-async-handler";

const createClubSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const updateClubSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export const createClub = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name, description } = createClubSchema.parse(req.body);

    // Check if club already exists
    const clubExists = await ClubModel.findOne({ name });
    if (clubExists) {
      res.status(400);
      throw new Error("Club with this name already exists");
    }

    const club = new ClubModel({
      name,
      description,
    });

    const savedClub = await club.save();
    res.status(201).json(savedClub);
  }
);

export const getClubs = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const clubs = await ClubModel.find();
    res.json(clubs);
  }
);

export const getClubById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const club = await ClubModel.findById(req.params.id);
    if (!club) {
      res.status(404);
      throw new Error("Club not found");
    }
    res.json(club);
  }
);

export const updateClub = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const updates = updateClubSchema.parse(req.body);
    const club = await ClubModel.findById(req.params.id);

    if (!club) {
      res.status(404);
      throw new Error("Club not found");
    }

    if (updates.name) {
      // Check if new name already exists
      const nameExists = await ClubModel.findOne({ name: updates.name });
      if (nameExists && nameExists._id.toString() !== club._id.toString()) {
        res.status(400);
        throw new Error("Club with this name already exists");
      }
      club.name = updates.name;
    }

    if (updates.description) {
      club.description = updates.description;
    }

    const updatedClub = await club.save();
    res.json(updatedClub);
  }
);

export const deleteClub = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const club = await ClubModel.findById(req.params.id);
    if (!club) {
      res.status(404);
      throw new Error("Club not found");
    }

    await club.deleteOne();
    res.json({ message: "Club deleted successfully" });
  }
);

export const getClubEvents = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const club = await ClubModel.findById(req.params.id);

    if (!club) {
      res.status(404);
      throw new Error("Club not found");
    }

    const events = await club.getEvents();
    res.json(events);
  }
);
