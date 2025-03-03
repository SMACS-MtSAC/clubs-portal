import { Router } from "express";
import { registerHandler } from "../controllers/auth.controller";
const authRoutes = Router();

/**
 *  TODO:
 *      - Add the inside code that makes it work
 *      - Place them in a controller
 */
authRoutes.post("/login", (req, res) => {
  res.send("Post logina");
});

/**
 * TODO:
 *      - Add the inside code that makes it work
 *      - Place them in a controller
 */
authRoutes.post("/register", registerHandler);

export default authRoutes;
