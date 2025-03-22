import { Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "../constants/env";

const generateToken = (res: Response, userId: any) => {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
