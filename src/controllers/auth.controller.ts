import { Request, Response } from "express";
import { z } from "zod";
import UserModel from "../models/user.model";

const passwordSchema = z.string().min(6);

const loginSchema = z.object({
  username: z.string(),
  password: passwordSchema,
});

const registerSchema = loginSchema
  .extend({
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const registerHandler = async (req: Request, res: Response) => {
  try {
    const request = registerSchema.parse({
      ...req.body,
    });
    const newUser = new UserModel({
      username: request.username,
      password: request.password,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: `Error creating the user`, error: error });
  }
};
