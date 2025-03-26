import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";
import { JWT_SECRET } from "../constants/env";
import expressAsyncHandler from "express-async-handler";

interface JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = await UserModel.findById(decoded.userId).select("-password");
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);

export const authorize = (...roles: string[]) => {
  return expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized");
      }

      if (!roles.includes(req.user.role)) {
        res.status(403);
        throw new Error(
          `User role ${req.user.role} is not authorized to access this route`
        );
      }

      next();
    }
  );
};

export const authorizeClubOfficer = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "club_officer") {
      res.status(403);
      throw new Error("Not authorized as club officer");
    }

    if (
      req.params.clubId &&
      req.user.clubId?.toString() !== req.params.clubId
    ) {
      res.status(403);
      throw new Error("Not authorized to access this club's resources");
    }

    next();
  }
);
