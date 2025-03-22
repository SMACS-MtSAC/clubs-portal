import { Request, Response } from "express";
import { z } from "zod";
import UserModel from "../models/user.model";
import expressAsyncHandler from "express-async-handler";
import generateToken from "../utils/jwt";
import mongoose from "mongoose";
import { ADMIN_PASSKEY1, ADMIN_PASSKEY2 } from "../constants/env";
const passwordSchema = z.string().min(6);

const loginSchema = z.object({
  username: z.string(),
  password: passwordSchema,
});

const registerSchema = loginSchema
  .extend({
    confirmPassword: passwordSchema,
    clubId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const updateProfileSchema = z.object({
  username: z.string().optional(),
  clubId: z.string().optional(),
});

const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

const createAdminSchema = loginSchema
  .extend({
    confirmPassword: passwordSchema,
    passkey1: z.string(),
    passkey2: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const registerHandler = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const registerBody = registerSchema.parse({
      ...req.body,
    });

    const userExists = await UserModel.findOne({
      username: registerBody.username,
    });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Get the registering user (admin or club officer)
    const registeringUser = await UserModel.findById(req.user._id);
    if (!registeringUser) {
      res.status(404);
      throw new Error("Registering user not found");
    }

    // Validate club ID based on registering user's role
    if (registeringUser.role === "club_officer") {
      // Club officers can only register users in their own club
      if (
        !registerBody.clubId ||
        registerBody.clubId !== registeringUser.clubId?.toString()
      ) {
        res.status(403);
        throw new Error("You can only register users in your own club");
      }
    } else if (registeringUser.role === "admin") {
      // Admins can register users in any club
      if (!registerBody.clubId) {
        res.status(400);
        throw new Error("Club ID is required");
      }
    }

    const newUser = new UserModel({
      username: registerBody.username,
      password: registerBody.password,
      role: "club_officer",
      clubId: new mongoose.Types.ObjectId(registerBody.clubId),
    });

    const savedUser = await newUser.save();
    if (savedUser) {
      generateToken(res, savedUser._id);
      res.status(201).json({
        _id: savedUser._id,
        username: savedUser.username,
        role: savedUser.role,
        clubId: savedUser.clubId,
      });
    }
  }
);

export const authUser = expressAsyncHandler(async (req, res) => {
  const { username, password } = loginSchema.parse(req.body);
  const user = await UserModel.findOne({ username });

  if (user && (await user.matchPasswords(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      clubId: user.clubId,
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

export const getCurrentUser = expressAsyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id).select("-password");
  if (user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      clubId: user.clubId,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const updateUserProfile = expressAsyncHandler(async (req, res) => {
  const updates = updateProfileSchema.parse(req.body);
  const user = await UserModel.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (updates.username) {
    const usernameExists = await UserModel.findOne({
      username: updates.username,
    });
    if (
      usernameExists &&
      usernameExists._id.toString() !== user._id.toString()
    ) {
      res.status(400);
      throw new Error("Username already exists");
    }
    user.username = updates.username;
  }

  if (updates.clubId && user.role === "club_officer") {
    user.clubId = new mongoose.Types.ObjectId(updates.clubId);
  }

  const updatedUser = await user.save();
  res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    role: updatedUser.role,
    clubId: updatedUser.clubId,
  });
});

export const changePassword = expressAsyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
  const user = await UserModel.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (await user.matchPasswords(currentPassword)) {
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } else {
    res.status(401);
    throw new Error("Current password is incorrect");
  }
});

export const createAdmin = expressAsyncHandler(async (req, res) => {
  const { username, password, confirmPassword, passkey1, passkey2 } =
    createAdminSchema.parse(req.body);

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  if (passkey1 !== ADMIN_PASSKEY1) {
    res.status(401);
    throw new Error("Invalid passkey 1");
  }

  if (passkey2 !== ADMIN_PASSKEY2) {
    res.status(401);
    throw new Error("Invalid passkey 2");
  }

  const userExists = await UserModel.findOne({ username });
  if (userExists) {
    res.status(400);
    throw new Error("Username already exists");
  }

  const admin = new UserModel({
    username,
    password,
    role: "admin",
  });

  const savedAdmin = await admin.save();
  if (savedAdmin) {
    generateToken(res, savedAdmin._id);
    res.status(201).json({
      _id: savedAdmin._id,
      username: savedAdmin.username,
      role: savedAdmin.role,
    });
  }
});
