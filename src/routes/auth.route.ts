import { Router } from "express";
import { registerHandler } from "../controllers/auth.controller";
const authRoutes = Router();

authRoutes.post("/login", (req, res) => {
  res.send("Post login");
});

authRoutes.post("/register", registerHandler);

authRoutes.post("/change-password", (req, res) => {
  res.send("Change Password");
});

export default authRoutes;
