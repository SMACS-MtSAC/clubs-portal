import { Request, Response } from "express";
import { z } from "zod";
import UserModel from "../models/user.model";
import expressAsyncHandler from "express-async-handler";
import generateToken from "../utils/jwt";

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
    if (savedUser) {
      generateToken(res, savedUser._id);
      res.status(201).json({
        username: savedUser.username,
      });
    }
  }
);

export const authUser = expressAsyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (user && (await user.matchPasswords(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

export const logoutUser = expressAsyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "Logged out",
  });
});
