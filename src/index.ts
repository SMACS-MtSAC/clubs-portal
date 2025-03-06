import "dotenv/config";
import express from "express";
import { NODE_ENV, PORT, MONGO_URI } from "./constants/env";
import conntectToDatabase from "./config/db";
import UserModel from "./models/user.model";
import authRoutes from "./routes/auth.route";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    status: "Healthy",
  });
});

app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} environment`);
  conntectToDatabase();
});
