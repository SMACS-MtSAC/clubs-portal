import { Router } from "express";
import {
  authUser,
  logoutUser,
  registerHandler,
} from "../controllers/auth.controller";
const authRoutes = Router();

authRoutes.post("/login", (req, res) => {
  res.send("Post login");
});

authRoutes.post("/register", registerHandler);
authRoutes.post("/auth", authUser);
authRoutes.post("/logout", logoutUser);
authRoutes.post("/change-password", (req, res) => {
  res.send("Change Password");
});

export default authRoutes;
