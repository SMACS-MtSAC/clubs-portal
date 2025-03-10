import { Request, Response } from "express";
import { z } from "zod";
import UserModel from "../models/user.model";
import expressAsyncHandler from "express-async-handler";

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

export const registerHandler = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const request = registerSchema.parse({
      ...req.body,
    });
    const newUser = new UserModel({
      username: request.username,
      password: request.password,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  }
);
